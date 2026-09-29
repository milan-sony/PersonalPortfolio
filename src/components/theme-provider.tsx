import { createContext, useContext, useEffect, useState } from "react"

// "auto" follows the visitor's clock, "system" follows their device setting
type Theme = "dark" | "light" | "system" | "auto"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "auto",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Daytime runs from 6am to 6pm. index.html repeats these hours in its pre-paint script.
export const DAY_STARTS = 6
export const DAY_ENDS = 18

const themeForHour = (date = new Date()) =>
    date.getHours() >= DAY_STARTS && date.getHours() < DAY_ENDS ? "light" : "dark"

export function ThemeProvider({
    children,
    defaultTheme = "auto",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(storageKey) as Theme
        return ["dark", "light", "system", "auto"].includes(stored) ? stored : defaultTheme
    })

    useEffect(() => {
        const root = window.document.documentElement

        const apply = (resolved: "light" | "dark") => {
            if (root.classList.contains(resolved)) return
            root.classList.remove("light", "dark")
            root.classList.add(resolved)
        }

        if (theme === "auto") {
            apply(themeForHour())

            // a page left open over sunrise or sunset switches within the minute
            const timer = setInterval(() => apply(themeForHour()), 60 * 1000)
            return () => clearInterval(timer)
        }

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            apply(systemTheme)
            return
        }

        apply(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            // nothing is stored for "auto", so it stays the default for that visitor
            if (theme === "auto") localStorage.removeItem(storageKey)
            else localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
