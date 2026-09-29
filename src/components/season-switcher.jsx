import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSeason } from "@/lib/season-context";
import { SEASONS } from "@/lib/seasons";

export function SeasonSwitcher() {
    const { setting, season, currentSeason, setSeason } = useSeason();

    return (
        // not modal, so opening it doesn't lock scrolling and nudge the page sideways
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full transition-transform duration-500 hover:scale-110"
                >
                    <img src={season.emblem} alt="" className="size-5" />
                    <span className="sr-only">Change season, now showing {season.name}</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Season</DropdownMenuLabel>

                <DropdownMenuRadioGroup value={setting} onValueChange={setSeason}>
                    <DropdownMenuRadioItem value="auto" className="gap-3 py-2">
                        <img src={currentSeason.emblem} alt="" className="size-5" />
                        <span className="flex flex-col">
                            <span>Follow the calendar</span>
                            <span className="text-xs text-muted-foreground">It's {currentSeason.name.toLowerCase()} right now</span>
                        </span>
                    </DropdownMenuRadioItem>

                    <DropdownMenuSeparator />

                    {SEASONS.map((item) => (
                        <DropdownMenuRadioItem key={item.id} value={item.id} className="gap-3 py-2">
                            <img src={item.emblem} alt="" className="size-5" />
                            <span className="flex flex-col">
                                <span>{item.name}</span>
                                <span className="text-xs text-muted-foreground">{item.range}</span>
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
