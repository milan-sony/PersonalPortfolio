import React, { useRef, useState } from 'react'
import { Check, CircleAlert, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "../../../utils/data";
import { LIMITS, validateContact } from "../../../utils/contact-validation";

const EMPTY = { name: "", email: "", message: "" };
const FIELDS = ["name", "email", "message"];

const STATUS = {
    sending: "Sending your message...",
    sent: "Message sent successfully! Thanks for reaching out.",
    failed: "Sorry, your message couldn't be sent. Please try again.",
    invalid: "Please check the highlighted fields.",
};

// Underlined control: the rule below it takes the accent colour on focus and red when invalid.
// rounded-none cancels the radius the global :focus-visible rule adds, which would curve the underline.
const controlClass =
    "mt-2 block w-full rounded-none bg-transparent py-3 text-base border-b border-input outline-none " +
    "transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/70 " +
    "focus-visible:outline-none focus:border-signal focus:shadow-[0_1px_0_0_var(--signal)] " +
    "aria-invalid:border-destructive aria-invalid:shadow-[0_1px_0_0_var(--destructive)] disabled:opacity-60";

function Field({ id, label, error, trailing, as = "input", className = "", ...props }) {
    const Control = as;
    const errorId = `${id}-error`;

    return (
        <div className="group">
            <label htmlFor={id} className="block text-sm text-muted-foreground transition-colors duration-300 group-focus-within:text-signal">
                {label}
            </label>

            <Control
                id={id}
                name={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={`${controlClass} ${className}`}
                {...props}
            />

            <div className="mt-2 flex min-h-5 items-start justify-between gap-4 text-xs sm:text-sm">
                <p id={errorId} className="text-destructive">{error}</p>
                {trailing}
            </div>
        </div>
    );
}

function ContactForm() {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [website, setWebsite] = useState("");           // honeypot, people never see it
    const [attempted, setAttempted] = useState(false);    // errors update live only after a first try
    const [status, setStatus] = useState({ state: "idle", message: "" });
    const startedAt = useRef(Date.now());                // when the form appeared; the server ignores instant submits
    const refs = { name: useRef(null), email: useRef(null), message: useRef(null) };
    const inFlight = useRef(false);                       // blocks a second click before React re-renders

    const sending = status.state === "sending";

    const update = (field) => (e) => {
        const next = { ...values, [field]: e.target.value };
        setValues(next);
        if (attempted) setErrors(validateContact(next).errors);
        if (status.state === "sent") setStatus({ state: "idle", message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inFlight.current) return;

        setAttempted(true);
        const result = validateContact(values);
        setErrors(result.errors);

        if (!result.ok) {
            refs[FIELDS.find((field) => result.errors[field])].current?.focus();
            setStatus({ state: "error", message: STATUS.invalid });
            return;
        }

        inFlight.current = true;
        setStatus({ state: "sending", message: STATUS.sending });
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...result.values, website, startedAt: startedAt.current }),
                signal: controller.signal,
            });
            const data = await response.json().catch(() => ({}));

            if (response.ok && data.ok) {
                setValues(EMPTY);
                setErrors({});
                setAttempted(false);
                setStatus({ state: "sent", message: STATUS.sent });
            } else {
                if (data.fields) setErrors(data.fields);
                setStatus({ state: "error", message: typeof data.error === "string" ? data.error : STATUS.failed });
            }
        } catch {
            setStatus({ state: "error", message: STATUS.failed });
        } finally {
            clearTimeout(timer);
            inFlight.current = false;
        }
    };

    const messageLength = values.message.trim().length;
    const overLimit = messageLength > LIMITS.message.max;

    return (
        <form onSubmit={handleSubmit} noValidate aria-busy={sending} className="relative grid gap-y-6">

            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Field
                    id="name"
                    label="Name"
                    ref={refs.name}
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={update("name")}
                    error={errors.name}
                    disabled={sending}
                />

                <Field
                    id="email"
                    label="Email"
                    ref={refs.email}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={update("email")}
                    error={errors.email}
                    disabled={sending}
                />
            </div>

            <Field
                id="message"
                label="Message"
                as="textarea"
                ref={refs.message}
                rows={5}
                placeholder="What would you like to talk about?"
                className="min-h-32 resize-y"
                value={values.message}
                onChange={update("message")}
                error={errors.message}
                disabled={sending}
                trailing={
                    <span className={`shrink-0 tabular-nums ${overLimit ? "text-destructive" : "text-muted-foreground"}`}>
                        {messageLength} / {LIMITS.message.max}
                    </span>
                }
            />

            {/* Honeypot: off screen and out of the tab order. Bots that fill it get a quiet "sent". */}
            <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                    type="submit"
                    size="lg"
                    disabled={sending}
                    className="rounded-full px-6 self-start focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                    {sending
                        ? <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                        : <Send aria-hidden="true" />}
                    {contact.form.button}
                </Button>

                <p
                    role="status"
                    aria-live="polite"
                    className={`flex items-start gap-2 text-sm leading-snug ${
                        status.state === "error" ? "text-destructive" : status.state === "sent" ? "text-signal" : "text-muted-foreground"
                    }`}
                >
                    {status.state === "sent" && <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                    {status.state === "error" && <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                    {status.message}
                </p>
            </div>

        </form>
    );
}

export default ContactForm
