import * as z from "zod";
import { NOTIFICATION_TYPE } from "../utils/notification";
import { HTTP_METHOD, api } from "../lib/api";

const NotificationBaseSchema = z.object({
    id: z.string(),
    user: z.string(),
    title: z.string(),
    seen: z.boolean(),
    createdAt: z.string().transform((val) => new Date(val)),
});

const DefaultNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.DEFAULT) })
    .merge(NotificationBaseSchema);

const LoginWelcomeBackNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.LOGIN_WELCOME_BACK) })
    .merge(NotificationBaseSchema);

const SignupWelcomeNotificationSchema = z
    .object({ type: z.literal(NOTIFICATION_TYPE.SIGNUP_WELCOME) })
    .merge(NotificationBaseSchema);

const GetNotificationsSchema = z.object({
    totalCount: z.number().min(0),
    nextPageOffset: z.number().min(0),
    notifications: z.array(
        z.union([
            DefaultNotificationSchema,
            LoginWelcomeBackNotificationSchema,
            SignupWelcomeNotificationSchema,
        ])
    ),
});

type GetMany = z.infer<typeof GetNotificationsSchema>;

export type Notification = GetMany["notifications"][number];

class NotificationService {
    constructor() {}

    async getMany(limit: number, offset: number): Promise<GetMany> {
        const [ok] = await api.fetch<GetMany, "GET_NOTIFICATIONS">(
            "GET_NOTIFICATIONS",
            {
                method: HTTP_METHOD.GET,
                params: { limit, offset },
                isProtected: true,
            },
            (data, status) =>
                status === 200 &&
                typeof data === "object" &&
                data !== null &&
                "notifications" in data &&
                "totalCount" in data &&
                "nextPageOffset" in data,
            GetNotificationsSchema
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
            { method: HTTP_METHOD.PATCH, params: { markAll: "true" } },
            (_, status) => status === 204
        );
    }
}

export const notificationService = new NotificationService();
