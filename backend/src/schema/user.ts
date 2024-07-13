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
    query: z.object({
        userId: z
            .string({ required_error: "Required" })
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid 'userId'.",
            }),
    }),
});

// ====================================
// Types
// ====================================

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CheckUsernameOrEmailAlreadyTaken = z.infer<
    typeof checkUsernameOrEmailAlreadyTakenSchema
>;
export type GetUserPublicProfile = z.infer<typeof getUserPublicProfileSchema>;
