import Reveal from "./Reveal";

// Shared section frame: heading in the left rail, content on the right
export default function Section({ id, title, intro, children }) {
    return (
        <section id={id} className="px-5 sm:px-8 py-20 sm:py-24 lg:py-28">
            <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-12 lg:gap-12">

                <Reveal className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <h2 className="font-display text-3xl sm:text-4xl font-light tracking-tight text-balance">
                            {title}
                        </h2>

                        {intro && (
                            <p className="mt-4 max-w-xs text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {intro}
                            </p>
                        )}
                    </div>
                </Reveal>

                <div className="lg:col-span-8">
                    {children}
                </div>

            </div>
        </section>
    );
}
