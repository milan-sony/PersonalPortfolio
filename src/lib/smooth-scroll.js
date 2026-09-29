import Lenis from "lenis";
import "lenis/dist/lenis.css";

// One shared smooth scroller for the page. Visitors who ask for reduced
// motion keep the browser's own scrolling, and so do touch screens.
let lenis = null;

export function startSmoothScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => { };

    lenis = new Lenis({
        autoRaf: true,
        lerp: 0.11,
        anchors: true,
    });

    return () => {
        lenis.destroy();
        lenis = null;
    };
}

export const pauseScroll = () => lenis?.stop();

export const resumeScroll = () => lenis?.start();

export function scrollToTop() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
}
