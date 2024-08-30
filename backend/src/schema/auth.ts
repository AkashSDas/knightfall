import { z } from "zod";

// ====================================
// Schemas
// ====================================

/**
 * @swagger
 * components:
 *  schemas:
 *      EmailSignupSchema:
 *          type: object
 *          required:
 *              - username
 *              - email
 *          properties:
 *              username:
 *                  type: string
 *                  default: Rock
 *              email:
 *                  type: string
 *                  default: rock@gmail.com
 */
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

export const completeOAuthSchema = z.object({
    body: z.object({
        username: z
            .string({ required_error: "Required" })
            .min(2, "Username must be more than 2 characters long")
            .max(256, "Username must be less than 256 characters long"),
    }),
});

// ====================================
// Types
// ====================================

export type EmailSignup = z.infer<typeof emailSignupSchema>;
export type EmailLogin = z.infer<typeof emailLoginSchema>;
export type EmailCompleteMagicLinkLogin = z.infer<
    typeof emailCompleteMagicLinkLoginSchema
>;
export type CompleteOAuth = z.infer<typeof completeOAuthSchema>;
