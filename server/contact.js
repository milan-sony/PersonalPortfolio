// Handles a contact form submission: checks it, applies the spam limits and
// sends it through Resend. Framework-free so api/contact.js (Vercel) and the
// dev server plugin in vite.config.js can both use it.
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { contact } from "../utils/data.js";
import { validateContact } from "../utils/contact-validation.js";

// Visitors never set the subject
export const SUBJECT = "New message from my portfolio";

export const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

export const MESSAGES = {
    sent: "Message sent successfully! Thanks for reaching out.",
    invalid: "Please check the highlighted fields.",
    tooSoon: "Please wait a moment before sending another message.",
    tooMany: "You've sent several messages recently. Please try again in a few minutes.",
    failed: "Sorry, your message couldn't be sent. Please try again.",
    notConfigured: "The contact form isn't set up yet. Please email me directly instead.",
};

// Lightweight abuse limits. The counters live in memory, so on Vercel each
// warm function instance keeps its own. Good enough for a personal site.
export const LIMITS = {
    windowMs: 10 * 60 * 1000,   // look-back period for the per-address count
    maxPerWindow: 5,            // messages allowed per address in that period
    minGapMs: 20 * 1000,        // minimum pause between two messages from one address
    duplicateMs: 60 * 60 * 1000, // identical messages inside this period are sent once
    minFillMs: 3 * 1000,        // a form submitted faster than this was not filled by a person
};

const sendTimes = new Map();   // ip -> timestamps of accepted messages
const seenMessages = new Map(); // fingerprint -> time it was sent

const prune = (now) => {
    for (const [ip, times] of sendTimes) {
        const kept = times.filter((t) => now - t < LIMITS.windowMs);
        if (kept.length) sendTimes.set(ip, kept); else sendTimes.delete(ip);
    }
    for (const [key, time] of seenMessages) {
        if (now - time >= LIMITS.duplicateMs) seenMessages.delete(key);
    }
};

const fingerprint = (values) =>
    createHash("sha256")
        .update([values.email.toLowerCase(), values.message].join("\n"))
        .digest("hex");

const escapeHtml = (text) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildEmail = ({ name, email, message }) => ({
    subject: SUBJECT,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
  <h2 style="font-size:18px;margin:0 0 16px">${escapeHtml(SUBJECT)}</h2>
  <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p style="margin:0 0 16px"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <p style="margin:0 0 4px"><strong>Message:</strong></p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
</div>`,
});

// Sends through Resend. Returns nothing on success and throws on failure.
async function sendWithResend({ apiKey, from, to, values }) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to,
        replyTo: values.email,
        ...buildEmail(values),
    });
    if (error) throw new Error(`${error.name ?? "resend_error"}: ${error.message}`);
}

// First address in X-Forwarded-For is the visitor; the rest are proxies
export function getClientIp(headers = {}, fallback = "unknown") {
    const forwarded = headers["x-forwarded-for"];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0].trim();
    return first || headers["x-real-ip"] || fallback;
}

// Takes the request pieces, returns { status, body } for the HTTP response.
// `send` and `now` can be swapped out in tests.
export async function handleContact({ method, body, ip = "unknown", env = {}, send = sendWithResend, now = Date.now() }) {
    if (method !== "POST") {
        return { status: 405, body: { ok: false, error: "Method not allowed." } };
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { status: 400, body: { ok: false, error: "Expected a JSON object." } };
    }

    // Bots fill the hidden field or submit instantly. They get a quiet "sent".
    const startedAt = Number(body.startedAt);
    const tooFast = Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < LIMITS.minFillMs;
    if (body.website || tooFast) {
        return { status: 200, body: { ok: true } };
    }

    const { ok, values, errors } = validateContact(body);
    if (!ok) {
        return { status: 400, body: { ok: false, error: MESSAGES.invalid, fields: errors } };
    }

    prune(now);

    const times = sendTimes.get(ip) ?? [];
    if (times.length && now - times[times.length - 1] < LIMITS.minGapMs) {
        return { status: 429, body: { ok: false, error: MESSAGES.tooSoon } };
    }
    if (times.length >= LIMITS.maxPerWindow) {
        return { status: 429, body: { ok: false, error: MESSAGES.tooMany } };
    }

    // The same message again (a double click, a retry) counts as already sent
    const key = fingerprint(values);
    if (seenMessages.has(key)) {
        return { status: 200, body: { ok: true } };
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("[contact] RESEND_API_KEY is not set");
        return { status: 503, body: { ok: false, error: MESSAGES.notConfigured } };
    }

    try {
        await send({
            apiKey,
            from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
            to: env.CONTACT_TO_EMAIL || contact.email,
            values,
        });
    } catch (error) {
        console.error("[contact] send failed:", error?.message ?? error);
        return { status: 502, body: { ok: false, error: MESSAGES.failed } };
    }

    sendTimes.set(ip, [...times, now]);
    seenMessages.set(key, now);

    return { status: 200, body: { ok: true } };
}

// Only used by tests, so one test's history does not leak into the next
export function resetContactLimits() {
    sendTimes.clear();
    seenMessages.clear();
}
