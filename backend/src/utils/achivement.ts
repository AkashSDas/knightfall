import { type ValueOf } from "./types";

/** Achievements that a player can unlock. */
export const ACHIEVEMENTS = {
    STRATEGIST: "strategist",
    WARRIOR: "warrior",
    SPEED: "speed",
    CASUAL: "casual",
    SURVIVOR: "survivor",
} as const;

export type Achievement = ValueOf<typeof ACHIEVEMENTS>;
