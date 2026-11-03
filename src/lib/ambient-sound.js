// The seasonal background sound. One shared player for the page, built on the
// Web Audio API so the loop has no gap: each pass of a recording is a separate
// buffer source, and the next pass starts a few seconds before the last one
// ends with an equal-power crossfade, so the seam can't be heard.
//
// Browsers usually allow sound only after the visitor has clicked, tapped or
// pressed a key, so nothing is created until `unlockSound` runs inside such an
// event, or `canPlayWithoutGesture` says this browser makes an exception.

const VOLUME = 0.5;          // ambience sits under everything else
const SEASON_FADE = 2.5;     // seconds to crossfade between two seasons
const LOOP_OVERLAP = 4;      // seconds the end of one pass overlaps the next
const LOOKAHEAD = 12;        // seconds of passes scheduled ahead of the clock

const AudioContextClass = typeof window !== "undefined"
    ? window.AudioContext || window.webkitAudioContext
    : undefined;

export const soundSupported = Boolean(AudioContextClass);

let context = null;
let master = null;
let enabled = false;
let wantedUrl = null;
let track = null;            // { url, gain, sources, next, timer, buffer }
let suspendTimer = null;
const buffers = new Map();   // url -> Promise<AudioBuffer>

// equal-power fade curves, so two unrelated recordings keep a steady loudness
const curve = (rising) => {
    const steps = 64;
    const values = new Float32Array(steps);
    for (let i = 0; i < steps; i++) {
        const angle = (i / (steps - 1)) * (Math.PI / 2);
        values[i] = rising ? Math.sin(angle) : Math.cos(angle);
    }
    return values;
};
const FADE_IN = curve(true);
const FADE_OUT = curve(false);

// Freeze a value where it is right now, so a new fade starts without a jump.
// Firefox has no cancelAndHoldAtTime; there the last value set is close enough.
const hold = (param, now) => {
    if (param.cancelAndHoldAtTime) {
        param.cancelAndHoldAtTime(now);
    } else {
        param.cancelScheduledValues(now);
        param.setValueAtTime(param.value, now);
    }
};

const load = (url) => {
    if (!buffers.has(url)) {
        const pending = fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error(`Could not load ${url}`);
                return response.arrayBuffer();
            })
            .then((data) => context.decodeAudioData(data));
        // a failed download can be tried again on the next season change
        pending.catch(() => buffers.delete(url));
        buffers.set(url, pending);
    }
    return buffers.get(url);
};

// Schedule passes until the lookahead window is covered
function pump(current) {
    const { buffer } = current;
    const overlap = Math.min(LOOP_OVERLAP, buffer.duration / 4);

    while (current.next < context.currentTime + LOOKAHEAD) {
        const start = current.next;
        const end = start + buffer.duration;

        const source = context.createBufferSource();
        source.buffer = buffer;
        const fade = context.createGain();
        fade.gain.setValueCurveAtTime(FADE_IN, start, overlap);
        fade.gain.setValueCurveAtTime(FADE_OUT, end - overlap, overlap);
        source.connect(fade).connect(current.gain);
        source.start(start);
        source.stop(end);

        current.sources.add(source);
        source.onended = () => {
            current.sources.delete(source);
            fade.disconnect();
        };

        current.next = end - overlap;
    }
}

function fadeOutTrack(old) {
    if (!old) return;
    clearInterval(old.timer);
    const now = context.currentTime;
    hold(old.gain.gain, now);
    old.gain.gain.linearRampToValueAtTime(0, now + SEASON_FADE);
    old.sources.forEach((source) => {
        try {
            source.stop(now + SEASON_FADE + 0.05);
        } catch {
            // already stopped
        }
    });
    setTimeout(() => old.gain.disconnect(), (SEASON_FADE + 0.5) * 1000);
}

async function playUrl(url) {
    if (!context || track?.url === url) return;

    fadeOutTrack(track);
    track = null;
    if (!url) return;

    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(master);
    const current = { url, gain, sources: new Set(), next: 0, timer: null, buffer: null };
    track = current;

    let buffer;
    try {
        buffer = await load(url);
    } catch {
        // offline or blocked: stay silent rather than break the page
        if (track === current) track = null;
        gain.disconnect();
        return;
    }

    // the season changed again while this one was downloading
    if (track !== current) {
        gain.disconnect();
        return;
    }

    const now = context.currentTime;
    current.buffer = buffer;
    current.next = now + 0.05;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + SEASON_FADE);
    pump(current);
    current.timer = setInterval(() => pump(current), 1000);
}

// Fade the whole mix in or out. Sound plays only while it is switched on and
// the tab is in view; a hidden tab goes quiet and picks up where it left off.
function apply() {
    if (!context) return;

    const audible = enabled && document.visibilityState === "visible";
    const now = context.currentTime;
    hold(master.gain, now);
    clearTimeout(suspendTimer);

    if (audible) {
        context.resume().catch(() => { });
        master.gain.setTargetAtTime(VOLUME, now, 0.6);
        playUrl(wantedUrl);
    } else {
        master.gain.setTargetAtTime(0, now, 0.15);
        // stop the audio clock once it is silent, which also saves battery
        suspendTimer = setTimeout(() => context.suspend().catch(() => { }), 900);
    }
}

// A tenth of a second of silence as a WAV file, used to ask the browser
// whether it would play sound right now
function silentClip() {
    const rate = 8000;
    const samples = rate / 10;
    const view = new DataView(new ArrayBuffer(44 + samples));
    const text = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
    text(0, "RIFF");
    view.setUint32(4, 36 + samples, true);
    text(8, "WAVEfmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);          // PCM
    view.setUint16(22, 1, true);          // mono
    view.setUint32(24, rate, true);
    view.setUint32(28, rate, true);       // bytes per second
    view.setUint16(32, 1, true);          // bytes per sample
    view.setUint16(34, 8, true);          // bits per sample
    text(36, "data");
    view.setUint32(40, samples, true);
    for (let i = 0; i < samples; i++) view.setUint8(44 + i, 128);   // 8-bit silence

    // a data URL rather than a blob URL: nothing to revoke while it may still be loading
    let binary = "";
    new Uint8Array(view.buffer).forEach((byte) => { binary += String.fromCharCode(byte); });
    return `data:audio/wav;base64,${btoa(binary)}`;
}

// Whether this browser lets the page play sound before any click. Usually it
// doesn't; Chrome does for sites a visitor often plays media on, and every
// browser does when the visitor has set the site's sound to Allow. Asking
// first, instead of just starting an AudioContext, keeps the console free of
// "AudioContext was not allowed to start" warnings.
export async function canPlayWithoutGesture() {
    if (!AudioContextClass) return false;

    if (navigator.getAutoplayPolicy) {
        try {
            return navigator.getAutoplayPolicy("audiocontext") === "allowed";
        } catch {
            // fall through to the test clip
        }
    }

    const probe = new Audio(silentClip());
    try {
        await probe.play();
        probe.pause();
        return true;
    } catch {
        return false;
    }
}

// Run inside a click, tap or key press, or after canPlayWithoutGesture said
// yes. Resolves to whether the audio clock is actually running.
export function unlockSound() {
    if (!AudioContextClass) return Promise.resolve(false);

    if (!context) {
        context = new AudioContextClass();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        document.addEventListener("visibilitychange", apply);
    }

    return context.resume().then(() => context.state === "running", () => false);
}

export function setSoundEnabled(next) {
    enabled = next;
    apply();
}

export function setSoundTrack(url) {
    wantedUrl = url;
    if (enabled) playUrl(url);
}
