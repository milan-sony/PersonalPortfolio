import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../../../utils/data";

function Projects() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="text-left mb-14">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        🏗️ Projects
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p, i) => (
                        <Card key={i} className="border border-border/30 hover:shadow-2xl hover:-translate-y-2 transition">
                            <CardContent className="p-6 sm:p-6 flex flex-col h-full">

                                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                                    {p.name}
                                </h3>

                                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                                    {p.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {p.stack.map((s, j) => (
                                        <span key={j} className="text-xs px-2 py-1 bg-muted rounded">
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <Button size="sm" asChild>
                                        <a href={p.demoUrl}><ExternalLink size={14} /> Live</a>
                                    </Button>

                                    <Button size="sm" variant="outline" asChild>
                                        <a href={p.githubUrl}><Github size={14} /> Code</a>
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>

    )
}

export default Projects
