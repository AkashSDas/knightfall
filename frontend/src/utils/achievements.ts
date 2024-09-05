import Badge_PlayerRank_Bronze from "@/assets/badges/badge-player-rank-bronze.png";
import Badge_PlayerRank_Gold from "@/assets/badges/badge-player-rank-gold.png";
import Badge_PlayerRank_Iron from "@/assets/badges/badge-player-rank-iron.png";
import Badge_PlayerRank_Silver from "@/assets/badges/badge-player-rank-silver.png";
import Badge_PlayerRank_Casual from "@/assets/badges/badge-player-type-casual.png";
import Badge_PlayerRank_Speed from "@/assets/badges/badge-player-type-speed.png";
import Badge_PlayerRank_Strategist from "@/assets/badges/badge-player-type-strategist.png";
import Badge_PlayerRank_Survivor from "@/assets/badges/badge-player-type-survivor.png";
import Badge_PlayerRank_Warrior from "@/assets/badges/badge-player-type-warrior.png";
import Badge_Top_1 from "@/assets/badges/badge-top-1.png";
import Badge_Top_2 from "@/assets/badges/badge-top-2.png";
import Badge_Top_3 from "@/assets/badges/badge-top-3.png";
import Badge_Top_10 from "@/assets/badges/badge-top-10.png";
import Badge_Top_50 from "@/assets/badges/badge-top-50.png";
import Badge_Top_100 from "@/assets/badges/badge-top-100.png";
import { type GetUserPublicProfileResponse } from "@/services/user";

export function getAchievementsBoardImages(): string[] {
    return [
        Badge_PlayerRank_Bronze,
        Badge_PlayerRank_Iron,
        Badge_PlayerRank_Silver,
        Badge_PlayerRank_Gold,

        Badge_Top_1,
        Badge_Top_2,
        Badge_Top_3,
        Badge_Top_10,
        Badge_Top_50,
        Badge_Top_100,

        Badge_PlayerRank_Casual,
        Badge_PlayerRank_Speed,
        Badge_PlayerRank_Strategist,
        Badge_PlayerRank_Survivor,
        Badge_PlayerRank_Warrior,
    ];
}

export function getWinPointsSrc(winPoints: number): string {
    if (winPoints < 100) {
        return Badge_PlayerRank_Bronze;
    } else if (winPoints < 500) {
        return Badge_PlayerRank_Iron;
    } else if (winPoints < 1000) {
        return Badge_PlayerRank_Silver;
    } else {
        return Badge_PlayerRank_Gold;
    }
}

export function getRankImageSrc(
    rank: GetUserPublicProfileResponse["user"]["rank"]
): string | null {
    switch (rank) {
        case "Top 1":
            return Badge_Top_1;
        case "Top 2":
            return Badge_Top_2;
        case "Top 3":
            return Badge_Top_3;
        case "Top 10":
            return Badge_Top_10;
        case "Top 50":
            return Badge_Top_50;
        case "Top 100":
            return Badge_Top_100;
        default:
            return null;
    }
}

export function getAchievementImages(
    achievements: GetUserPublicProfileResponse["user"]["achievements"]
): string[] {
    return achievements
        .map(function (achievement) {
            switch (achievement) {
                case "casual":
                    return Badge_PlayerRank_Casual;
                case "speed":
                    return Badge_PlayerRank_Speed;
                case "strategist":
                    return Badge_PlayerRank_Strategist;
                case "survivor":
                    return Badge_PlayerRank_Survivor;
                case "warrior":
                    return Badge_PlayerRank_Warrior;
                default:
                    return "";
            }
        })
        .filter((v) => v !== "");
}
