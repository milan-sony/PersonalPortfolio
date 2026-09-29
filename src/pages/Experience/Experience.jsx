import React from "react";
import Section from "../../components/Section";
import Reveal from "../../components/Reveal";
import { experiences } from "../../../utils/data";

function Experience() {
    return (
        <Section id="experience" title="Experience">

            {/* Timeline */}
            <ol className="relative ml-1 border-l border-border">

                {experiences.map((exp, i) => {
                    const isCurrent = exp.years.includes("Present");

                    return (
                        <Reveal as="li" key={i} delay={i * 70} className="relative pl-7 sm:pl-10 pb-12 last:pb-0">

                            {/* Dot */}
                            <span className="absolute -left-[4.5px] top-2 grid place-items-center">
                                {isCurrent
                                    ? <span className="live-dot" />
                                    : <span className="size-2 rounded-full bg-muted-foreground/60" />}
                            </span>

                            {/* Header */}
                            <div className="flex flex-col-reverse gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                                <h3 className="text-lg sm:text-xl font-medium tracking-tight">
                                    {exp.title}
                                </h3>

                                <span className="text-sm text-muted-foreground tabular-nums sm:whitespace-nowrap">
                                    {exp.years}
                                </span>
                            </div>

                            <p className="text-sm sm:text-base">
                                <a href={exp.url} className="link-draw inline-block py-1 text-signal" target="_blank" rel="noopener noreferrer">{exp.company}</a>
                            </p>

                            {/* Achievements */}
                            <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {exp.achievements.map((a, j) => (
                                    <li key={j} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-muted-foreground/60">
                                        {a}
                                    </li>
                                ))}
                            </ul>

                        </Reveal>
                    );
                })}

            </ol>

        </Section>
    );
}

export default Experience;
