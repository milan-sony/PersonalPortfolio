import React from 'react'
import Section from '../../components/Section';
import Reveal from '../../components/Reveal';
import { educations } from "../../../utils/data";

function Education() {
    return (
        <Section id="education" title="Education">

            <ol className="border-b border-border">
                {educations.map((edu, i) => (
                    <Reveal
                        as="li"
                        key={i}
                        delay={i * 70}
                        className="group grid gap-x-8 gap-y-1 border-t border-border py-6 sm:grid-cols-[8rem_1fr]"
                    >

                        <span className="text-sm text-muted-foreground tabular-nums sm:pt-1 transition-colors duration-300 group-hover:text-signal">
                            {edu.years}
                        </span>

                        <div>
                            <h3 className="text-lg sm:text-xl font-medium tracking-tight">
                                {edu.degree}
                            </h3>

                            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
                                {edu.institution}
                            </p>

                            {edu.university && (
                                <p className="text-sm text-muted-foreground">
                                    {edu.university}
                                </p>
                            )}
                        </div>

                    </Reveal>
                ))}
            </ol>

        </Section>
    )
}

export default Education
