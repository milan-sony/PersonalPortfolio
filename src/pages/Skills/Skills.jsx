import React from 'react'
import Section from '../../components/Section';
import Reveal from '../../components/Reveal';
import { skills } from "../../../utils/data";

function Skills() {
    return (
        <Section id="skills" title="Skills">

            <div className="border-b border-border">
                {skills.map((skill, i) => (
                    <Reveal
                        key={i}
                        delay={i * 60}
                        className="grid gap-x-8 gap-y-3 border-t border-border py-6 sm:grid-cols-[11rem_1fr]"
                    >

                        <h3 className="text-sm sm:text-base font-medium sm:pt-1">
                            {skill.category}
                        </h3>

                        <ul className="flex flex-wrap gap-2">
                            {skill.items.map((item, j) => (
                                <li
                                    key={j}
                                    className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:border-signal hover:text-foreground"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>

                    </Reveal>
                ))}
            </div>

        </Section>
    )
}

export default Skills
