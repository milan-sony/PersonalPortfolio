import React from 'react'
import { Github, Linkedin, Instagram } from "lucide-react";
import { socialLinks } from "../../utils/data";

const iconMap = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram
};

function Footer() {
    return (
        <footer className="px-6 py-12">

            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 text-center">

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-5">
                    {socialLinks.map((link, index) => {
                        const Icon = iconMap[link.icon];
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    p-2 rounded-full
                                    text-muted-foreground
                                    hover:text-foreground
                                    transition-all duration-300
                                    hover:scale-110
                                "
                            >
                                <Icon size={20} />
                            </a>
                        );
                    })}
                </div>

                {/* Bottom Text */}
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Milan Sony
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Built with 💖 using React & Tailwind CSS and Schadcn/ui.
                    </p>
                </div>

            </div>

        </footer>
    )
}

export default Footer
