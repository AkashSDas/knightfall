import * as z from "zod";

import { HTTP_METHOD, api } from "@/lib/api";
import { NotificationSchema } from "@/utils/schemas";

// ===================================
// Schemas
// ===================================

const GetNotificationsResponseSchema = z.object({
    totalCount: z.number().min(0),
    nextPageOffset: z.number().min(0),
    notifications: z.array(NotificationSchema),
});

// ===================================
// Service
// ===================================

class NotificationService {
    constructor() {}

    async getLoggedInUserNotifications(
        limit: number,
        offset: number
    ): Promise<z.infer<typeof GetNotificationsResponseSchema>> {
        const [ok] = await api.fetch<
            z.infer<typeof GetNotificationsResponseSchema>,
            "GET_NOTIFICATIONS"
        >(
            "GET_NOTIFICATIONS",
            {
                method: HTTP_METHOD.GET,
                params: { limit, offset },
                isProtected: true,
            },
            function (data, status) {
                return (
                    status === 200 &&
                    typeof data === "object" &&
                    data !== null &&
                    "notifications" in data &&
                    "totalCount" in data &&
                    "nextPageOffset" in data
                );
            },
            GetNotificationsResponseSchema
        );

        if (!ok) {
            return { nextPageOffset: 0, notifications: [], totalCount: 0 };
        } else {
            return ok;
        }
    }

    async markAsSeen() {
        return await api.fetch(
            "MARK_NOTIFICATION_AS_SEEN",
            {
                method: HTTP_METHOD.PATCH,
                params: { markAll: "true" },
                isProtected: true,
            },
            (_, status) => status === 204
        );
    }
}

/** Interact with notifications endpoints. */
export const notificationService = new NotificationService();
