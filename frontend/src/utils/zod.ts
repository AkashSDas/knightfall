import * as z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    username: z.string().optional(),
    email: z.string(),
    isBanned: z.boolean(),
    profilePic: z.object({ URL: z.string() }),
    oauthProviders: z.array(
        z.object({ sid: z.string(), provider: z.string() })
    ),
    createdAt: z.string().transform((v) => new Date(v)),
    updatedAt: z.string().transform((v) => new Date(v)),
    winPoints: z.number().min(0),
    achievements: z.array(z.string()),
});
