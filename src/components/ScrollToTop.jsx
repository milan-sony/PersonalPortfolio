import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/smooth-scroll";

export default function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            tabIndex={show ? 0 : -1}
            className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 grid size-11 place-items-center rounded-full border border-border bg-[var(--nav-surface)] text-foreground backdrop-blur-md transition-all duration-500 hover:border-signal hover:text-signal ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
            <ArrowUp size={18} />
        </button>
    );
}
