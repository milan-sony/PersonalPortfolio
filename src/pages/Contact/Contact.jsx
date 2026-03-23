import React from 'react'
import { Mail, Phone, MapPin } from "lucide-react";
import { contact } from "../../../utils/data";

function Contact() {
    return (
        <section className="py-24 px-6" id='contact'>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

                <div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        🤝 Let's connect.
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Feel free to reach out for collaborations or just a friendly chat.
                    </p>
                </div>

                <div className="space-y-6">
                    {contact.links.map((item, i) => (
                        <div key={i} className="flex gap-4 border-b pb-4">

                            {item.label.includes("Mail") && <Mail />}
                            {item.label.includes("Phone") && <Phone />}
                            {item.label.includes("Location") && <MapPin />}

                            <div>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-sm sm:text-base">{item.value}</p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Contact
