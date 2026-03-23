import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { experiences } from "../../../utils/data";

function Experience() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-left mb-14">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        👷 Experience
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {experiences.map((exp, i) => (
                        <Card key={i} className="border border-border/30 hover:border-border/60 transition">
                            <CardContent className="p-6 sm:p-6">

                                <div className="flex justify-between mb-4">
                                    <h3 className="text-lg sm:text-xl font-semibold">
                                        {/* <span>{exp.emoji}</span> */}
                                        {exp.title}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">{exp.years}</span>
                                </div>

                                <ul className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed list-disc pl-5">
                                    {exp.achievements.map((a, j) => (
                                        <li key={j}>{a}</li>
                                    ))}
                                </ul>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Experience
