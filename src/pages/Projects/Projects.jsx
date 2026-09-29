import React from 'react'
import { ExternalLink, Github } from "lucide-react";
import Section from '../../components/Section';
import Reveal from '../../components/Reveal';
import { projects } from "../../../utils/data";

// Feeds the pointer position to the card's spotlight
const trackPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

function Projects() {
    // the first card is full width; with an even total the last one is too, so no slot is left empty
    const isWide = (i) => i === 0 || (projects.length % 2 === 0 && i === projects.length - 1);

    return (
        <Section id="projects" title="Projects">

            <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((p, i) => (
                    <Reveal
                        key={i}
                        delay={(i % 2) * 90}
                        className={isWide(i) ? "sm:col-span-2" : ""}
                    >
                        <article
                            onPointerMove={trackPointer}
                            className="spot-card flex h-full flex-col p-6 sm:p-7"
                        >

                            <h3 className="font-display text-lg sm:text-xl font-normal tracking-tight">
                                {p.name}
                            </h3>

                            <p className={`mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed ${isWide(i) ? "max-w-2xl" : ""}`}>
                                {p.description}
                            </p>

                            <ul className="mt-5 mb-7 flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
                                {p.stack.map((s, j) => (
                                    <li key={j} className="flex items-center gap-1.5">
                                        <span className="size-1 rounded-full bg-signal" />
                                        {s}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto -mb-2 flex flex-wrap gap-x-6 text-sm">
                                {p.demoUrl && (
                                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-2 py-2">
                                        <ExternalLink size={15} /> Live demo
                                    </a>
                                )}

                                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-2 py-2">
                                    <Github size={15} /> Source code
                                </a>
                            </div>

                        </article>
                    </Reveal>
                ))}
            </div>

        </Section>

    )
}

export default Projects
