// Validation for the contact form, shared by the browser and the server.
// Keep this file free of browser and Node specifics.

export const LIMITS = {
    name: { max: 80 },
    email: { max: 254 },
    message: { min: 10, max: 2000 },
};

// Good enough for a contact form: something@something.tld with no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Drops control characters (except line breaks and tabs), normalises line
// endings and trims the ends. Line breaks are removed entirely from single-line fields.
export function sanitizeText(value, { multiline = false } = {}) {
    if (typeof value !== "string") return "";
    let text = value.replace(/\r\n?/g, "\n");
    // eslint-disable-next-line no-control-regex
    text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    if (!multiline) text = text.replace(/[\n\t]+/g, " ");
    return text.trim();
}

// Returns the cleaned values and a message for each field that failed.
export function validateContact(input = {}) {
    const values = {
        name: sanitizeText(input.name),
        email: sanitizeText(input.email),
        message: sanitizeText(input.message, { multiline: true }),
    };

    const errors = {};

    if (!values.name) {
        errors.name = "Please enter your name.";
    } else if (values.name.length > LIMITS.name.max) {
        errors.name = `Please keep your name under ${LIMITS.name.max} characters.`;
    }

    if (!values.email) {
        errors.email = "Please enter your email address.";
    } else if (values.email.length > LIMITS.email.max || !EMAIL_PATTERN.test(values.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!values.message) {
        errors.message = "Please enter a message.";
    } else if (values.message.length < LIMITS.message.min) {
        errors.message = `Please write at least ${LIMITS.message.min} characters.`;
    } else if (values.message.length > LIMITS.message.max) {
        errors.message = `Please keep your message under ${LIMITS.message.max} characters.`;
    }

    return { values, errors, ok: Object.keys(errors).length === 0 };
}
