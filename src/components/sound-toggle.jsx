import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSeason } from "@/lib/season-context";
import {
    canPlayWithoutGesture,
    setSoundEnabled,
    setSoundTrack,
    soundSupported,
    unlockSound,
} from "@/lib/ambient-sound";

const SOUND_STORAGE_KEY = "portfolio-sound";

// On unless the visitor has turned it off before
const readSetting = () => {
    try {
        return localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
    } catch {
        return true;
    }
};

// Clicks, taps and key presses count as permission to play sound; scrolling doesn't
const GESTURES = ["pointerdown", "pointerup", "touchend", "keydown", "click"];

// The dark theme is night, the light theme is day
const isDark = () => document.documentElement.classList.contains("dark");

export function SoundToggle() {
    const { season } = useSeason();
    const [enabled, setEnabled] = useState(readSetting);
    const [started, setStarted] = useState(false);
    const [night, setNight] = useState(isDark);

    // follow the theme, whether it changes by the clock or from the menu
    useEffect(() => {
        const observer = new MutationObserver(() => setNight(isDark()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setSoundTrack(night ? season.sound.night : season.sound.day);
    }, [season.sound, night]);

    // Start as soon as the browser allows: right away if it makes an exception
    // for this site, otherwise on the first interaction anywhere on the page.
    // The button itself is left out, so a first click on it mutes instead of
    // playing a blip of sound.
    useEffect(() => {
        if (!enabled || started) return;
        let cancelled = false;

        const stopListening = () => GESTURES.forEach((type) => window.removeEventListener(type, start, true));

        const begin = () => {
            stopListening();
            setSoundEnabled(true);
            setStarted(true);
        };

        function start(event) {
            if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return;
            // a touch that starts a scroll isn't permission yet; wait for the next one
            if (navigator.userActivation && !navigator.userActivation.isActive) return;

            unlockSound();
            begin();
        }

        GESTURES.forEach((type) => window.addEventListener(type, start, true));

        canPlayWithoutGesture()
            .then((allowed) => (allowed && !cancelled ? unlockSound() : false))
            .then((running) => {
                if (running && !cancelled) begin();
            });

        return () => {
            cancelled = true;
            stopListening();
        };
    }, [enabled, started]);

    // the page is leaving the profile (the 404 page has no nav), so go quiet
    useEffect(() => () => setSoundEnabled(false), []);

    if (!soundSupported) return null;

    const toggle = () => {
        const next = !enabled;
        try {
            if (next) localStorage.removeItem(SOUND_STORAGE_KEY);
            else localStorage.setItem(SOUND_STORAGE_KEY, "off");
        } catch {
            // storage blocked: the choice still applies for this visit
        }
        setEnabled(next);

        // this click is the permission the browser needs
        if (next) {
            unlockSound();
            setStarted(true);
        }
        setSoundEnabled(next);
    };

    return (
        <button
            type="button"
            data-sound-toggle
            onClick={toggle}
            aria-pressed={enabled}
            className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
            {/* waiting for the first click before the sound can start */}
            {enabled && !started && <span aria-hidden="true" className="sound-hint" />}
            <Volume2 className={`size-[1.1rem] transition-all duration-500 ${enabled ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
            <VolumeX className={`absolute size-[1.1rem] transition-all duration-500 ${enabled ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} />
            <span className="sr-only">Ambient sound of the season</span>
        </button>
    );
}
