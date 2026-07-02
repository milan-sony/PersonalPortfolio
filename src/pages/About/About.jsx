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
                    I'm a self-taught developer and IoT enthusiast from India 🇮🇳. I strive to become a professional in everything I do while maintaining a healthy work-life balance ✨. I have a passion for technology and enjoy going to the gym 💪. With a solid academic background in computer applications, I love web design, web development, and IoT 🚀. In my free time, I listen to music 🎧, watch movies 🍿, go for walks 🚶, or catch up on sleep 💤. I'm eager to connect with like-minded individuals 🥂. Feel free to reach out to me at milansonyofficial@gmail.com to discuss coding 💻, seek guidance 📚, chat 😄, or just grab a virtual coffee ☕ Hahaha... 😂
                </p>

            </div>
        </section>
    )
}

export default About
