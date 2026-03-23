import React from 'react'
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from '../../components/theme-toggle';
import ScrollToTop from '../../components/ScrollToTop';

function Hero() {
    return (
        <>
            <section className="relative min-h-dvh flex items-center px-6">

                {/* Theme Toggle (Top Right) */}
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>

                <div className="max-w-6xl mx-auto w-full">
                    <div className="max-w-3xl">

                        <p className="text-sm text-muted-foreground mb-4">
                            👋 Hi, I'm
                        </p>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-tight">
                            Milan Sony
                        </h1>

                        <h2 className="mt-4 text-base sm:text-lg text-muted-foreground">
                            Software Developer | IoT Enthusiast
                        </h2>

                        <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                            <span className="line-through">Everything</span> you need to know about me is here.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Button asChild>
                                <a href="#contact">Contact</a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/Resume-Milan_Sony.pdf" target="_blank" rel="noopener noreferrer" download="Resume_MilanSony">
                                    Download Resume
                                </a>
                            </Button>
                        </div>

                        <div className="mt-8 flex gap-5 text-muted-foreground">
                            <Github className="hover:text-foreground cursor-pointer" />
                            <Linkedin className="hover:text-foreground cursor-pointer" />
                            <Mail className="hover:text-foreground cursor-pointer" />
                        </div>

                    </div>
                </div>

            </section>

            <ScrollToTop />
        </>

    )
}

export default Hero
