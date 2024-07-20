import { z } from "zod";
import { Types } from "mongoose";

// ====================================
// Schemas
// ====================================

export const getDirectMessagesSchema = z.object({
    query: z
        .object({
            limit: z
                .string()
                .regex(/^\d+$/)
                .transform((limit) => parseInt(limit, 10))
                .optional()
                .refine((val) => val > 0, {
                    message: "'limit' must be a positive integer.",
                })
                .refine((val) => val <= 20, {
                    message: "'limit' must not exceed 20.",
                }),
            offset: z
                .string()
                .regex(/^\d+$/)
                .transform((offset) => parseInt(offset, 10))
                .optional()
                .refine((val) => val >= 0, {
                    message: "'offset' must be a positive integer.",
                }),
            friendId: z.string().refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid 'friendId'.",
            }),
        })
        .refine(
            (data) => {
                return !(data.limit !== undefined && data.offset === undefined);
            },
            { message: "'offset' must be provided if 'limit' is provided." },
        ),
});

// ====================================
// Types
// ====================================

export type GetDirectMessagesSchema = z.infer<typeof getDirectMessagesSchema>;
