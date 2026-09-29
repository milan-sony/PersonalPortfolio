import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { ArrowDown, Download } from "lucide-react";
import SignalLattice from '../../components/SignalLattice';
import { experiences, personalDetails } from "../../../utils/data";
import { useSeason } from "@/lib/season-context";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: personalDetails.timeZone,
});

// Milan's local time, so visitors know whether he's likely awake
function LocalTime() {
    const [time, setTime] = useState(() => timeFormat.format(new Date()));

    useEffect(() => {
        const timer = setInterval(() => setTime(timeFormat.format(new Date())), 15000);
        return () => clearInterval(timer);
    }, []);

    return <span className="tabular-nums">{time} {personalDetails.timeZoneLabel}</span>;
}

function Hero() {
    // the first role still marked as "Present", or simply the latest one
    const currentJob = experiences.find((exp) => exp.years.includes("Present")) ?? experiences[0];
    const currentRole = currentJob?.title.split("|")[0].trim();
    const { tagline, resume } = personalDetails;
    const contentRef = useRef(null);

    // The hero content eases back and fades as the page scrolls away from it
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let frame = 0;

        const update = () => {
            frame = 0;
            const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
            contentRef.current.style.opacity = 1 - progress;
            contentRef.current.style.transform = `translate3d(0, ${progress * 60}px, 0)`;
        };

        const handleScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const { season } = useSeason();

    return (
        <section id="top" className="relative isolate flex min-h-dvh flex-col overflow-hidden px-5 sm:px-8">

            {/* Lattice fades out towards the bottom and behind the text */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                }}
            >
                <SignalLattice />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_20%_55%,var(--background)_0%,transparent_75%)]" />
            </div>

            <div ref={contentRef} className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center pt-28 pb-12 will-change-transform">

                {/* Season emblem */}
                <div className="fade-in absolute right-0 top-24 sm:top-[22%] sm:right-[8%]" style={{ "--delay": "1200ms" }}>
                    <img
                        key={season.id}
                        src={season.emblem}
                        alt=""
                        className={`size-16 sm:size-24 lg:size-32 ${season.motion}`}
                    />
                </div>

                <p className="fade-in text-sm sm:text-base text-muted-foreground" style={{ "--delay": "150ms" }}>
                    Hi, I'm
                </p>

                <h1 className="mt-3 font-display font-medium leading-[0.95] tracking-[-0.045em] text-[clamp(3.25rem,13vw,10rem)]">
                    {personalDetails.name.split(" ").map((word, i) => (
                        <span key={i} className="rise-line" style={{ "--delay": `${250 + i * 130}ms` }}>
                            <span>{word}</span>
                        </span>
                    ))}
                </h1>

                <div className="fade-in mt-8 max-w-xl" style={{ "--delay": "700ms" }}>
                    <h2 className="text-lg sm:text-xl text-foreground">
                        {personalDetails.title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        <span className="line-through decoration-signal">{tagline.struck}</span> {tagline.rest}
                    </p>
                </div>

                <div className="fade-in mt-9 flex flex-col sm:flex-row gap-3" style={{ "--delay": "850ms" }}>
                    <Button size="lg" className="rounded-full px-6 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal" asChild>
                        <a href="#contact">Contact me</a>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-6 bg-transparent backdrop-blur-sm focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal" asChild>
                        <a href={resume.file} target="_blank" rel="noopener noreferrer" download={resume.downloadName}>
                            <Download /> Download resume
                        </a>
                    </Button>
                </div>

            </div>

            {/* Status strip */}
            <div className="fade-in mx-auto flex w-full max-w-6xl items-end gap-6 border-t border-border py-5" style={{ "--delay": "1050ms" }}>
                <dl className="grid flex-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    {currentJob && (
                        <div>
                            <dt className="text-muted-foreground">Currently</dt>
                            <dd className="mt-1 flex items-center gap-2.5">
                                <span className="live-dot shrink-0" />
                                <span>{currentRole} at {currentJob.company}</span>
                            </dd>
                        </div>
                    )}
                    <div>
                        <dt className="text-muted-foreground">Based in</dt>
                        <dd className="mt-1">{personalDetails.basedIn}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Local time</dt>
                        <dd className="mt-1"><LocalTime /></dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">{season.name}</dt>
                        <dd className="mt-1">{season.weather}</dd>
                    </div>
                </dl>

                <a
                    href="#about"
                    aria-label="Scroll to about"
                    className="hidden sm:grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-signal hover:text-signal"
                >
                    <ArrowDown size={16} />
                </a>
            </div>

        </section>
    )
}

export default Hero
