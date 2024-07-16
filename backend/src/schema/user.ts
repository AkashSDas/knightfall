import { Types } from "mongoose";
import { z } from "zod";

// ====================================
// Schemas
// ====================================

export const updateProfileSchema = z.object({
    body: z
        .object({
            username: z
                .string({ required_error: "Required" })
                .min(2, "Username must be more than 2 characters long")
                .max(256, "Username must be less than 256 characters long")
                .optional(),
        })
        .strict({ message: "Extra fields not allowed" }),
});

export const checkUsernameOrEmailAlreadyTakenSchema = z.object({
    body: z
        .object({
            username: z
                .string({ required_error: "Required" })
                .min(2, "Username must be more than 2 characters long")
                .max(256, "Username must be less than 256 characters long")
                .optional(),
            email: z
                .string({ required_error: "Required" })
                .email("Invalid email")
                .optional(),
        })
        .strict({ message: "Extra fields not allowed" }),
});

export const getUserPublicProfileSchema = z.object({
    params: z.object({
        userId: z
            .string({ required_error: "Required" })
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid 'userId'.",
            }),
    }),
});

export const searchPlayerByUsernameOrUserIdSchema = z.object({
    query: z
        .object({
            queryText: z
                .string({ required_error: "Required" })
                .max(256, "Too long"),
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

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CheckUsernameOrEmailAlreadyTaken = z.infer<
    typeof checkUsernameOrEmailAlreadyTakenSchema
>;
export type GetUserPublicProfile = z.infer<typeof getUserPublicProfileSchema>;
export type SearchPlayerByUsernameOrUserId = z.infer<
    typeof searchPlayerByUsernameOrUserIdSchema
>;
