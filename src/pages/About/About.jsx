import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

function About() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto text-left">

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-10">
                    🤷 Who am I?
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    A self-taught developer from India 🇮🇳. I'm working on becoming the best developer I can be by maintaining a healthy work-life balance ✨. With a strong academic foundation in computer applications and a love for web design, web development, and IoT 🚀, I'm excited to connect with like-minded folks 🥂. Feel free to reach out to me at milansonyofficial@gmail.com to discuss coding 💻, get guidance 📚, chat 😄, or just grab a virtual coffee ☕ Hahaha... 😂
                </p>

            </div>
        </section>
    )
}

export default About
