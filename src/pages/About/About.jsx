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
                    I'm a simple human being 👦, a self-taught, passionate, and dedicated developer from INDIA 🇮🇳 who is trying to become good at everything I do while maintaining a healthy work-life balance ⚖️✨. I have a strong academic background in computer applications 🎓 and a love for web design 🎨, web development 💻, and IoT 🧩. I'm always excited to connect with like-minded individuals who share my interests 🤝🍻.
                    I like to listen to music 🎶, hit the gym 💪, watch movies 🎬, go for walks 🚶, or catch up on sleep 😴. Yeah, these are the things I do 🙂. Anyway, feel free to reach out to me at 📧 milansonyofficial@gmail.com or dial me at 📞 +91-8075143465 😉.
                </p>

            </div>
        </section>
    )
}

export default About
