import { z } from "zod";

import { HTTP_METHOD, api } from "@/lib/api";
import { DirectMessage } from "@/utils/schemas";

// ===================================
// Schemas
// ===================================

const GetManyDMsResponseSchema = z.object({
    nextPageOffset: z.number().min(0),
    totalCount: z.number().min(0),
    directMessages: z.array(DirectMessage),
});

// ===================================
// Service
// ===================================

class DirectMessageService {
    constructor() {}

    async getDMs(limit: number, offset: number, friendId: string) {
        const [ok] = await api.fetch<
            z.infer<typeof GetManyDMsResponseSchema>,
            "GET_DIRECT_MESSAGES"
        >(
            "GET_DIRECT_MESSAGES",
            {
                method: HTTP_METHOD.GET,
                params: { limit, offset, friendId },
                isProtected: true,
            },
            function (data, status) {
                return (
                    status === 200 &&
                    typeof data === "object" &&
                    data !== null &&
                    "directMessages" in data &&
                    "totalCount" in data &&
                    "nextPageOffset" in data
                );
            },
            GetManyDMsResponseSchema
        );

        if (!ok) {
            return { nextPageOffset: 0, directMessages: [], totalCount: 0 };
        } else {
            return ok;
        }
    }
}

/** Interact with direct messages endpoints. */
export const directMessageService = new DirectMessageService();
