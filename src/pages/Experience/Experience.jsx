import React from "react";
import { experiences } from "../../../utils/data";

function Experience() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Title */}
                <div className="mb-14">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        👷 Experience
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-border/40 ml-4">

                    {experiences.map((exp, i) => (
                        <div key={i} className="mb-10 ml-6">

                            {/* Dot */}
                            <span className="absolute -left-2.5 flex items-center justify-center w-5 h-5 bg-primary rounded-full ring-4 ring-background"></span>

                            {/* Content */}
                            <div className="bg-background border border-border/30 rounded-xl p-5 hover:border-border/60 transition">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            <a href={exp.url} className="hover:cursor-pointer hover:text-black" target="_blank" rel="noopener noreferrer">{exp.company}</a>
                                        </p>

                                        <h3 className="text-lg sm:text-xl font-semibold">
                                            {exp.title}
                                        </h3>
                                    </div>

                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        {exp.years}
                                    </span>
                                </div>

                                {/* Achievements */}
                                <ul className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed list-disc pl-5">
                                    {exp.achievements.map((a, j) => (
                                        <li key={j}>{a}</li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Experience;