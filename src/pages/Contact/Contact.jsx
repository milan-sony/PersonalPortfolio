import React, { useState } from 'react'
import { Copy, Check } from "lucide-react";
import Reveal from '../../components/Reveal';
import ContactForm from './ContactForm';
import { getContactIcon } from "@/lib/icons";
import { contact } from "../../../utils/data";

function Contact() {
    // "", "copied" or "blocked"
    const [copyState, setCopyState] = useState("");

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(contact.email);
            setCopyState("copied");
        } catch {
            setCopyState("blocked");
        }
        setTimeout(() => setCopyState(""), 2500);
    };

    return (
        <section className="px-5 sm:px-8 py-20 sm:py-24 lg:py-28" id='contact'>
            <div className="max-w-6xl mx-auto">

                <Reveal>
                    <h2 className="font-display font-medium leading-none tracking-[-0.04em] text-[clamp(2.5rem,9vw,7rem)]">
                        Let's connect.
                    </h2>

                    <p className="mt-6 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Feel free to reach out for collaborations or just a friendly chat.
                    </p>
                </Reveal>

                <div className="mt-14 grid border-b border-border md:grid-cols-3">
                    {contact.links.map((item, i) => {
                        const Icon = getContactIcon(item.label);
                        return (
                            <Reveal
                                key={i}
                                delay={i * 90}
                                className="border-t border-border py-6 md:pr-8"
                            >

                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Icon size={15} className="text-signal" />
                                    {item.label}
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    {item.url
                                        ? <a href={item.url} className="link-draw py-1 text-base sm:text-lg break-all">{item.value}</a>
                                        : <p className="text-base sm:text-lg">{item.value}</p>}

                                    {item.label === "Mail" && (
                                        <button
                                            type="button"
                                            onClick={copyEmail}
                                            aria-label="Copy email address"
                                            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-signal"
                                        >
                                            {copyState === "copied" ? <Check size={15} /> : <Copy size={15} />}
                                        </button>
                                    )}
                                </div>

                                {item.label === "Mail" && (
                                    <p className="min-h-4 text-xs text-signal" aria-live="polite">
                                        {copyState === "copied" && "Email copied"}
                                        {copyState === "blocked" && "Your browser blocked copying. Select the address instead."}
                                    </p>
                                )}

                            </Reveal>
                        );
                    })}
                </div>

                {/* The form, framed like the other sections: heading on the left, content on the right */}
                <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <Reveal className="lg:col-span-4">
                        <h3 className="font-display text-2xl sm:text-3xl font-light tracking-tight text-balance">
                            {contact.form.heading}
                        </h3>

                        <p className="mt-4 max-w-xs text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {contact.form.intro}
                        </p>
                    </Reveal>

                    <Reveal delay={120} className="lg:col-span-8">
                        <ContactForm />
                    </Reveal>
                </div>

            </div>
        </section>
    )
}

export default Contact
