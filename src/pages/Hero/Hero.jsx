import React from 'react'
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

function Hero() {
    return (
        <section className="min-h-dvh flex items-center justify-center bg-background text-foreground px-6">

            <div className="max-w-4xl w-full text-center md:text-left">

                {/* Top small intro */}
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                    👋 Hi, I'm
                </p>

                {/* Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                    Milan Sony
                </h1>

                {/* Role */}
                <h2 className="mt-3 text-lg sm:text-xl md:text-2xl text-muted-foreground">
                    Software Developer • MERN • React • IoT
                </h2>

                {/* Description */}
                <p className="mt-6 max-w-xl text-sm sm:text-base text-muted-foreground">
                    I build modern, scalable web applications with clean UI and great user experience.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                    <Button className="w-full sm:w-auto">
                        View Projects
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        Download Resume
                    </Button>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex justify-center md:justify-start gap-5 text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition">
                        <Github size={20} />
                    </a>
                    <a href="#" className="hover:text-foreground transition">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" className="hover:text-foreground transition">
                        <Mail size={20} />
                    </a>
                </div>

            </div>
        </section>
    )
}

export default Hero
