import { z } from "zod";
import { HTTP_METHOD, api } from "../lib/api";

export const MATCH_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "inProgress",
    FINISHED: "finished",
    CANCELLED: "cancelled",
} as const;

const GetMatchSchema = z.object({
    match: z.object({
        status: z.nativeEnum(MATCH_STATUS),
        player1: z.object({
            id: z.string(),
            username: z.string().optional(),
            profilePic: z.object({ URL: z.string() }),
            winPoints: z.number().min(0),
            achievements: z.array(z.string()),
        }),
        player2: z.object({
            id: z.string(),
            username: z.string().optional(),
            profilePic: z.object({ URL: z.string() }),
            winPoints: z.number().min(0),
            achievements: z.array(z.string()),
        }),
        createdAt: z.string().transform((v) => new Date(v)),
        updatedAt: z.string().transform((v) => new Date(v)),
        id: z.string(),
    }),
});

class MatchService {
    constructor() {}

    async getById(matchId: string) {
        return await api.fetch<z.infer<typeof GetMatchSchema>, "GET_MATCH">(
            "GET_MATCH",
            {
                method: HTTP_METHOD.GET,
                isProtected: true,
                urlPayload: { matchId },
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "match" in data,
            GetMatchSchema
        );
    }
}

export const matchService = new MatchService();
