import { useEffect, useRef } from "react";

// Thin line along the top edge that fills as the page is read
export default function ScrollProgress() {
    const barRef = useRef(null);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
            barRef.current.style.transform = `scaleX(${progress})`;
        };

        const handleScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div
            ref={barRef}
            aria-hidden="true"
            className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-signal"
        />
    );
}
