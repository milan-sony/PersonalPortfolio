import React from 'react'
// import Navbar from '../../components/Navbar'
import Hero from '../Hero/Hero'
import About from '../About/About'
import Education from '../Education/Education'
import Skills from '../Skills/Skills'
import Experience from '../Experience/Experience'
import Projects from '../Projects/Projects'
import Contact from '../Contact/Contact'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

function Index() {
    return (
        <div>
            <Hero />
            <About />
            <Education />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
            <Footer />
        </div>
    )
}

export default Index