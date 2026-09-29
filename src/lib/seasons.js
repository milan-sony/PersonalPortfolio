import springBlossom from "@/assets/seasons/spring-blossom.svg";
import springPetal from "@/assets/seasons/spring-petal.svg";
import summerSun from "@/assets/seasons/summer-sun.svg";
import summerMote from "@/assets/seasons/summer-mote.svg";
import monsoonCloud from "@/assets/seasons/monsoon-cloud.svg";
import autumnLeaf from "@/assets/seasons/autumn-leaf.svg";
import autumnLeafGold from "@/assets/seasons/autumn-leaf-gold.svg";
import prewinterMist from "@/assets/seasons/prewinter-mist.svg";
import prewinterDew from "@/assets/seasons/prewinter-dew.svg";
import winterSnowflake from "@/assets/seasons/winter-snowflake.svg";

export const SEASON_STORAGE_KEY = "portfolio-season";

// The six seasons, each starting on the 15th of its first month. The weather
// notes follow India's climate: a dry hot summer, the southwest monsoon, its
// slow retreat, then clear skies into a cool dry winter.
// `motion` picks the emblem animation, `ambience` drives what is in the air.
export const SEASONS = [
    {
        id: "spring",
        name: "Spring",
        range: "Mid-February to mid-April",
        start: [2, 15],
        weather: "Mild days, trees in bloom",
        emblem: springBlossom,
        motion: "emblem-sway",
        ambience: {
            drift: {
                sprites: [springPetal],
                density: 24, size: [10, 20], vy: [22, 48], vx: [-14, 14],
                sway: [18, 40], spin: [-0.8, 0.8], alpha: [0.55, 0.9], tumble: true,
            },
        },
    },
    {
        id: "summer",
        name: "Summer",
        range: "Mid-April to mid-June",
        start: [4, 15],
        weather: "Hot days and dry winds",
        emblem: summerSun,
        motion: "emblem-spin",
        ambience: {
            // dust and heat carried sideways on the loo
            drift: {
                sprites: [summerMote],
                density: 24, size: [8, 24], vy: [-7, 5], vx: [36, 90],
                sway: [6, 16], spin: [0, 0], alpha: [0.3, 0.75], twinkle: true,
            },
        },
    },
    {
        id: "monsoon",
        name: "Monsoon",
        range: "Mid-June to mid-August",
        start: [6, 15],
        weather: "Heavy rain, humid air",
        emblem: monsoonCloud,
        motion: "emblem-float",
        ambience: {
            rain: { density: 90, length: [14, 28], vy: [620, 900], slant: -0.18, alpha: [0.18, 0.45] },
        },
    },
    {
        id: "autumn",
        name: "Autumn",
        range: "Mid-August to mid-October",
        start: [8, 15],
        weather: "The monsoon retreats, skies clear",
        emblem: autumnLeaf,
        motion: "emblem-sway",
        ambience: {
            drift: {
                sprites: [autumnLeaf, autumnLeafGold],
                density: 18, size: [14, 26], vy: [28, 60], vx: [-20, 10],
                sway: [24, 50], spin: [-1.2, 1.2], alpha: [0.6, 0.95], tumble: true,
            },
            // the last light showers of the retreating monsoon
            rain: { density: 16, length: [10, 18], vy: [480, 640], slant: -0.1, alpha: [0.12, 0.28] },
        },
    },
    {
        id: "prewinter",
        name: "Pre-Winter",
        range: "Mid-October to mid-December",
        start: [10, 15],
        weather: "Clear skies, misty mornings",
        emblem: prewinterMist,
        motion: "emblem-float",
        ambience: {
            drift: {
                sprites: [prewinterDew],
                density: 18, size: [6, 14], vy: [-6, 6], vx: [4, 14],
                sway: [4, 10], spin: [-0.2, 0.2], alpha: [0.25, 0.8], twinkle: true,
            },
            fog: true,
        },
    },
    {
        id: "winter",
        name: "Winter",
        range: "Mid-December to mid-February",
        start: [12, 15],
        weather: "Cool and dry, snow in the Himalayas",
        emblem: winterSnowflake,
        motion: "emblem-spin",
        ambience: {
            drift: {
                sprites: [winterSnowflake],
                density: 34, size: [7, 16], vy: [18, 42], vx: [-8, 8],
                sway: [10, 26], spin: [-0.4, 0.4], alpha: [0.4, 0.9],
            },
        },
    },
];

export const getSeason = (id) => SEASONS.find((season) => season.id === id);

// Which season a date falls in, going by the visitor's own calendar
export function getSeasonForDate(date = new Date()) {
    const today = (date.getMonth() + 1) * 100 + date.getDate();

    // walk backwards to the latest season that has already started
    const current = [...SEASONS]
        .reverse()
        .find((season) => today >= season.start[0] * 100 + season.start[1]);

    // before 15 February we are still in the winter that began in December
    return (current ?? getSeason("winter")).id;
}
