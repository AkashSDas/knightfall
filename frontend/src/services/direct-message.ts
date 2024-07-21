import { z } from "zod";
import { HTTP_METHOD, api } from "../lib/api";

const getManySchema = z.object({
    nextPageOffset: z.number().min(0),
    totalCount: z.number().min(0),
    directMessages: z.array(
        z.object({
            id: z.string(),
            friend: z.string(),
            previousMessage: z.string().nullable().optional(),
            createdAt: z.string(),
            updatedAt: z.string(),
            messages: z.array(
                z.object({
                    _id: z.string(),
                    user: z.string(),
                    text: z.string(),
                    createdAt: z.string(),
                    updatedAt: z.string(),
                    reactions: z.array(z.any()),
                })
            ),
        })
    ),
});

type GetMany = z.infer<typeof getManySchema>;
export type DirectMessage = GetMany["directMessages"][number];
export type Message = GetMany["directMessages"][number]["messages"][number];
export type MessageReaction =
    GetMany["directMessages"][number]["messages"][number]["reactions"][number];

class DirectMessageService {
    constructor() {}

    async getMany(limit: number, offset: number, friendId: string) {
        const [ok] = await api.fetch<GetMany, "GET_DIRECT_MESSAGES">(
            "GET_DIRECT_MESSAGES",
            {
                method: HTTP_METHOD.GET,
                params: { limit, offset, friendId },
                isProtected: true,
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "directMessages" in data &&
                "totalCount" in data &&
                "nextPageOffset" in data,
            getManySchema
        );

        if (!ok) {
            return { nextPageOffset: 0, directMessages: [], totalCount: 0 };
        } else {
            return ok;
        }
    }
}

export const directMessageService = new DirectMessageService();
