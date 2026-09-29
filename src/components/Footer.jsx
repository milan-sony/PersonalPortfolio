import React from 'react'
import { getSocialIcon } from "@/lib/icons";
import { personalDetails, socialLinks } from "../../utils/data";

function Footer() {
    return (
        <footer className="px-5 sm:px-8 pb-10">

            <div className="max-w-6xl mx-auto flex flex-col-reverse gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">

                {/* Bottom Text */}
                <div className="space-y-1">
                    <p className="text-sm">
                        © {new Date().getFullYear()} {personalDetails.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Built with React, Tailwind CSS and shadcn/ui.
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex flex-wrap items-center gap-2">
                    {socialLinks.map((link, index) => {
                        const Icon = getSocialIcon(link.icon);
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-signal hover:text-signal hover:-translate-y-0.5"
                            >
                                <Icon size={17} />
                            </a>
                        );
                    })}
                </div>

            </div>

        </footer>
    )
}

export default Footer
