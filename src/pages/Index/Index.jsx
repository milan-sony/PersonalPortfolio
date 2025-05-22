import React, { useEffect, useState } from 'react'

function Index() {

    const [theme, setTheme] = useState("light")
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (savedTheme) {
            setTheme(savedTheme)
        } else if (systemPrefersDark) {
            setTheme("dark")
        }
    }, [])

    useEffect(() => {
        const html = document.documentElement
        html.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold text-primary dark:text-secondary">Hello there</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn btn-primary dark:btn-secondary">Get Started</button>

                        <button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                            {
                                theme === 'dark' ? (
                                    <span>🌞</span>
                                ) : (
                                    <span>🌛</span>
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Index
