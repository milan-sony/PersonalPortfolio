import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { skills } from "../../../utils/data";

function Skills() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-left mb-14">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        🧩 Skills
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, i) => (
                        <Card key={i} className="border border-border/30 hover:border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardContent className="p-6 sm:p-6">

                                <div className="flex items-center gap-3 mb-5">
                                    {/* <span className="text-xl">{skill.emoji}</span> */}
                                    <h3 className="text-lg sm:text-xl font-semibold">
                                        {skill.category}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {skill.items.map((item, j) => (
                                        <span key={j} className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                                            {item}
                                        </span>
                                    ))}
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Skills
