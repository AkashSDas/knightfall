import { z } from "zod";

import { HTTP_METHOD, api } from "@/lib/api";
import { CHESS_PIECES, CHESS_PIECE_COLOR, MATCH_STATUS } from "@/utils/chess";

// ===================================
// Schemas
// ===================================

const GetMatchResponseSchema = z.object({
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
        player1Color: z.nativeEnum(CHESS_PIECE_COLOR),
        player2Color: z.nativeEnum(CHESS_PIECE_COLOR),
        createdAt: z.string().transform((v) => new Date(v)),
        updatedAt: z.string().transform((v) => new Date(v)),
        id: z.string(),
        startedAt: z
            .string()
            .transform((v) => new Date(v))
            .optional(),
        moves: z.array(
            z.object({
                turn: z.nativeEnum(CHESS_PIECE_COLOR),
                board: z.array(
                    z.array(
                        z.object({
                            color: z.nativeEnum(CHESS_PIECE_COLOR).nullable(),
                            type: z.nativeEnum(CHESS_PIECES).nullable(),
                        })
                    )
                ),
            })
        ),
    }),
});

// ===================================
// Service
// ===================================

class MatchService {
    constructor() {}

    async getMatch(matchId: string) {
        return await api.fetch<
            z.infer<typeof GetMatchResponseSchema>,
            "GET_MATCH"
        >(
            "GET_MATCH",
            {
                method: HTTP_METHOD.GET,
                isProtected: true,
                urlPayload: { matchId },
            },
            function (data, status) {
                return (
                    status === 200 &&
                    typeof data === "object" &&
                    data !== null &&
                    "match" in data
                );
            },
            GetMatchResponseSchema
        );
    }
}

/** Interact with match endpoints. */
export const matchService = new MatchService();
