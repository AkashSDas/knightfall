import { z } from "zod";

// ====================================
// Schemas
// ====================================

export const emailSignupSchema = z.object({
    body: z.object({
        username: z
            .string({ required_error: "Required" })
            .min(2, "Username must be more than 2 characters long")
            .max(256, "Username must be less than 256 characters long"),
        email: z.string({ required_error: "Required" }).email("Invalid email"),
    }),
});

export const emailLoginSchema = z.object({
    body: z.object({
        email: z.string({ required_error: "Required" }).email("Invalid email"),
    }),
});

export const emailCompleteMagicLinkLoginSchema = z.object({
    params: z.object({ token: z.string().min(10, "Invalid token param") }),
});

// ====================================
// Types
// ====================================

export type EmailSignup = z.infer<typeof emailSignupSchema>;
export type EmailLogin = z.infer<typeof emailLoginSchema>;
export type EmailCompleteMagicLinkLogin = z.infer<
    typeof emailCompleteMagicLinkLoginSchema
>;
