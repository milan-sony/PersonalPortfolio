import { useEffect, useMemo, useState } from "react";
import { SeasonContext } from "@/lib/season-context";
import { SEASON_STORAGE_KEY, getSeason, getSeasonForDate } from "@/lib/seasons";

const readSetting = () => {
    try {
        const stored = localStorage.getItem(SEASON_STORAGE_KEY);
        return stored && getSeason(stored) ? stored : "auto";
    } catch {
        return "auto";
    }
};

// `setting` is what the visitor picked ("auto" or a season id),
// `season` is the season actually on screen
export function SeasonProvider({ children }) {
    const [setting, setSettingState] = useState(readSetting);
    const [today, setToday] = useState(() => getSeasonForDate());

    const season = setting === "auto" ? today : setting;

    useEffect(() => {
        document.documentElement.dataset.season = season;
    }, [season]);

    // a tab left open across a season change catches up within the hour
    useEffect(() => {
        const timer = setInterval(() => setToday(getSeasonForDate()), 60 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    const value = useMemo(() => ({
        setting,
        season: getSeason(season),
        currentSeason: getSeason(today),
        setSeason: (next) => {
            try {
                if (next === "auto") localStorage.removeItem(SEASON_STORAGE_KEY);
                else localStorage.setItem(SEASON_STORAGE_KEY, next);
            } catch {
                // storage blocked: the choice still applies for this visit
            }
            setSettingState(next);
        },
    }), [setting, season, today]);

    return (
        <SeasonContext.Provider value={value}>
            {children}
        </SeasonContext.Provider>
    );
}
