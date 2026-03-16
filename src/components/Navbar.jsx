import { Button } from "@/components/ui/button";
import { Image, Menu, X } from "lucide-react";
import { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';
import { ThemeToggle } from "./theme-toggle";

const navbarLinks = [
    { name: "Home", to: "/home" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Main Navbar */}
            <nav className="px-4 py-2 bg-secondary flex justify-between items-center sticky top-0 z-50 shadow-sm">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <h1 className="flex items-center text-2xl font-extrabold font-roboto uppercase tracking-wide">
                        <Image className="mr-2" />
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navbarLinks.map((link) => (
                                <NavigationMenuItem key={link.name}>
                                    <NavigationMenuLink className="bg-secondary text-secondary-foreground" asChild>
                                        <Link
                                            to={link.to}
                                            className="px-4 py-2 text-md hover:text-red-500 transition-colors font-roboto"
                                        >
                                            {link.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-secondary shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                            <h1 className="flex items-center text-2xl font-extrabold font-roboto uppercase">
                                <Image className="mr-2" />
                            </h1>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={toggleMobileMenu}
                                aria-label="Close menu"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Links */}
                    <ul className="flex flex-col p-4 space-y-4 mt-4">
                        {navbarLinks.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.to}
                                    className="flex items-center p-3 text-base text-foreground-secondary hover:text-red-500 hover:bg-accent rounded-md transition-all font-roboto"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
