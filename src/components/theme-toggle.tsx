import { Clock, Moon, Sun } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    // an old "system" setting has no entry of its own here, so it shows under the clock option
    const value = theme === "light" || theme === "dark" ? theme : "auto"

    return (
        // not modal, so opening it doesn't lock scrolling and nudge the page sideways
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Sun className="size-[1.1rem] scale-100 rotate-0 transition-all duration-500 dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute size-[1.1rem] scale-0 rotate-90 transition-all duration-500 dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Change theme</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>

                <DropdownMenuRadioGroup value={value} onValueChange={(next) => setTheme(next as "auto" | "light" | "dark")}>
                    <DropdownMenuRadioItem value="auto" className="gap-3 py-2">
                        <Clock className="size-5" />
                        <span className="flex flex-col">
                            <span>Follow the time of day</span>
                            <span className="text-xs text-muted-foreground">Light from 6am to 6pm</span>
                        </span>
                    </DropdownMenuRadioItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuRadioItem value="light" className="gap-3 py-2">
                        <Sun className="size-5" />
                        <span>Light</span>
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="dark" className="gap-3 py-2">
                        <Moon className="size-5" />
                        <span>Dark</span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
