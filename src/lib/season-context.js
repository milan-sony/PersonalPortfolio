import { createContext, useContext } from "react";

export const SeasonContext = createContext(undefined);

export const useSeason = () => {
    const context = useContext(SeasonContext);

    if (context === undefined)
        throw new Error("useSeason must be used within a SeasonProvider");

    return context;
};
