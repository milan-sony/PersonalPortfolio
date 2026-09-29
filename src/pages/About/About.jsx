import React from 'react'
import Section from '../../components/Section';
import Reveal from '../../components/Reveal';
import { about, contact } from "../../../utils/data";

function About() {
    const mail = contact.links.find((link) => link.label === "Mail");
    const phone = contact.links.find((link) => link.label === "Phone");

    return (
        <Section id="about" title={about.heading}>

            <Reveal>
                <p className="font-display text-xl sm:text-2xl font-light leading-snug tracking-tight text-balance">
                    {about.lead}
                </p>
            </Reveal>

            <Reveal delay={120} className="mt-8 grid gap-6 sm:grid-cols-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {about.paragraphs.map((paragraph, i) => {
                    const isLast = i === about.paragraphs.length - 1;
                    return (
                        <p key={i}>
                            {paragraph}

                            {/* the closing line invites people to get in touch */}
                            {isLast && mail && (
                                <>
                                    {" "}Anyway, feel free to reach out to me at{" "}
                                    <a href={mail.url} className="link-draw text-foreground">{mail.value}</a>
                                    {phone && (
                                        <>
                                            {" "}or dial me at{" "}
                                            <a href={phone.url} className="link-draw text-foreground whitespace-nowrap">{phone.value}</a>
                                        </>
                                    )}.
                                </>
                            )}
                        </p>
                    );
                })}
            </Reveal>

        </Section>
    )
}

export default About
