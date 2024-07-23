import { Types } from "mongoose";
import { z } from "zod";

// ====================================
// Schemas
// ====================================

export const getMatchSchema = z.object({
    param: z.object({
        matchId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid 'matchId'",
        }),
    }),
});

// ====================================
// Types
// ====================================

export type GetMatchSchema = z.infer<typeof getMatchSchema>;
