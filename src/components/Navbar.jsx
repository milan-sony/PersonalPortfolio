import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { SeasonSwitcher } from "./season-switcher";
import { navbarLinks } from "../../utils/data";
import { pauseScroll, resumeScroll } from "@/lib/smooth-scroll";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    // while a clicked link is still scrolling into place, the sections passing by are ignored
    const jumpTarget = useRef(null);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const jumpTo = (id) => {
        closeMobileMenu();
        jumpTarget.current = id;
        setActiveSection(id);
    };

    // Highlight the link of the section crossing the middle of the screen
    useEffect(() => {
        const sections = navbarLinks
            .map((link) => document.getElementById(link.to.slice(1)))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && jumpTarget.current === null) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let settle;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
            if (window.scrollY < 200 && jumpTarget.current === null) setActiveSection("");

            // the jump is over once the page has stopped moving
            clearTimeout(settle);
            settle = setTimeout(() => {
                jumpTarget.current = null;
                if (window.scrollY < 200) setActiveSection("");
            }, 160);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            clearTimeout(settle);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // The mobile menu only exists below the md breakpoint, so close it when the window grows
    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 768px)");
        const handleChange = () => {
            if (desktop.matches) setIsMobileMenuOpen(false);
        };

        desktop.addEventListener("change", handleChange);
        return () => desktop.removeEventListener("change", handleChange);
    }, []);

    // Lock page scroll and listen for Escape while the mobile menu is open
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handleKey = (e) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        pauseScroll();
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = "";
            resumeScroll();
            window.removeEventListener("keydown", handleKey);
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Main Navbar */}
            <header className="fade-in fixed inset-x-0 top-0 z-50 px-4 pt-4" style={{ "--delay": "900ms" }}>
                {/* Fades out the page content that scrolls up behind the bar */}
                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background via-background/80 to-transparent transition-opacity duration-500 ${isScrolled && !isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                />
                <nav
                    aria-label="Main"
                    className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border py-1.5 pl-5 pr-2 transition-all duration-500 ${isScrolled || isMobileMenuOpen
                        ? "border-border bg-[var(--nav-surface)] backdrop-blur-xl"
                        : "border-transparent bg-transparent"
                        }`}
                >
                    {/* Logo */}
                    <a
                        href="#top"
                        onClick={() => jumpTo("")}
                        className="font-display -ml-2 grid h-9 place-items-center px-2 text-sm font-medium tracking-tight transition-colors hover:text-signal"
                        aria-label="Milan Sony, back to top"
                    >
                        MS
                    </a>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center lg:gap-1">
                        {navbarLinks.map((link) => {
                            const isActive = activeSection === link.to.slice(1);
                            return (
                                <li key={link.name}>
                                    <a
                                        href={link.to}
                                        onClick={() => jumpTo(link.to.slice(1))}
                                        aria-current={isActive ? "true" : undefined}
                                        className={`relative block rounded-full px-2.5 lg:px-3.5 py-2 text-sm whitespace-nowrap transition-colors duration-300 ${isActive
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute inset-x-2.5 lg:inset-x-3.5 -bottom-px h-px origin-left bg-signal transition-transform duration-500 ease-out-expo ${isActive ? "scale-x-100" : "scale-x-0"}`}
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-1">
                        <SeasonSwitcher />
                        <ThemeToggle />

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            className="md:hidden grid size-9 place-items-center rounded-full text-foreground"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                inert={!isMobileMenuOpen}
                className={`fixed inset-0 z-40 md:hidden overflow-y-auto bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <ul className="flex min-h-full flex-col justify-center gap-1 px-8 pt-24 pb-10">
                    {navbarLinks.map((link, i) => (
                        <li
                            key={link.name}
                            className={`transition-all duration-700 ease-out-expo ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                            style={{ transitionDelay: isMobileMenuOpen ? `${80 + i * 50}ms` : "0ms" }}
                        >
                            <a
                                href={link.to}
                                onClick={() => jumpTo(link.to.slice(1))}
                                className={`block py-2.5 font-display text-3xl font-light tracking-tight transition-colors ${activeSection === link.to.slice(1) ? "text-signal" : "text-foreground"}`}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
