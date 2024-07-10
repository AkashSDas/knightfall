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

export const checkUsernameOrEmailAlreadyTaken = z.object({
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

// ====================================
// Types
// ====================================

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CheckUsernameOrEmailAlreadyTaken = z.infer<
    typeof checkUsernameOrEmailAlreadyTaken
>;
