import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

function About() {
    return (
        <section className="py-20 px-6 bg-background text-foreground">

            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-10">
                    Who am I?
                </h2>

                {/* Content Card */}
                <Card className="border-none shadow-none bg-muted/40">
                    <CardContent className="p-6 sm:p-8">

                        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                            Hi 👋🏻, I'm{" "}
                            <span className="font-semibold text-foreground">
                                Milan Sony
                            </span>
                            , a passionate and dedicated developer from{" "}
                            <span className="font-semibold text-foreground">
                                INDIA 🇮🇳
                            </span>
                            , striving to excel as a{" "}
                            <span className="font-medium text-foreground">
                                full-stack developer
                            </span>{" "}
                            while maintaining my well-being ✨.
                            <br /><br />
                            With a strong academic foundation in computer applications and a love for{" "}
                            <span className="font-medium text-foreground">
                                web design
                            </span>
                            ,{" "}
                            <span className="font-medium text-foreground">
                                web development
                            </span>{" "}
                            and{" "}
                            <span className="font-medium text-foreground">
                                IoT
                            </span>
                            , I'm excited to connect with like-minded individuals who share my enthusiasm 🥂.
                            <br /><br />
                            When I'm not immersed in coding, I recharge with sleep 💤, ready to tackle new challenges 💪🏻.
                            <br /><br />
                            Feel free to reach out to me at{" "}
                            <a
                                href="mailto:milansonyofficial@gmail.com"
                                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                            >
                                milansonyofficial@gmail.com
                            </a>{" "}
                            to discuss my coding journey, offer guidance, or simply show support 😄.
                        </p>

                    </CardContent>
                </Card>

            </div>
        </section>
    )
}

export default About
