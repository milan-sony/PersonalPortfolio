import React, { useEffect } from 'react'
import Hero from '../Hero/Hero'
import About from '../About/About'
import Education from '../Education/Education'
import Skills from '../Skills/Skills'
import Experience from '../Experience/Experience'
import Projects from '../Projects/Projects'
import Contact from '../Contact/Contact'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import ScrollToTop from '../../components/ScrollToTop'
import SeasonalAmbience from '../../components/SeasonalAmbience'
import ScrollProgress from '../../components/ScrollProgress'
import { startSmoothScroll } from '@/lib/smooth-scroll'

function Index() {
    useEffect(() => startSmoothScroll(), []);

    return (
        <div>
            <a
                href="#content"
                className="fixed left-4 top-4 z-[70] -translate-y-20 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
            >
                Skip to content
            </a>
            <SeasonalAmbience />
            <ScrollProgress />
            <Navbar />
            <main id="content" tabIndex={-1} className="relative z-10 outline-none">
                <Hero />
                <About />
                <Education />
                <Skills />
                <Experience />
                <Projects />
                <Contact />
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
            <ScrollToTop />
        </div>
    )
}

export default Index
