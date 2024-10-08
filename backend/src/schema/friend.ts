import { Types } from "mongoose";
import { z } from "zod";

import { FRIEND_REQUEST_STATUS } from "@/utils/friend";

// ====================================
// Schemas
// ====================================

export const sendFriendRequest = z.object({
    body: z.object({
        toUserId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid 'userId'",
        }),
    }),
});

export const getLoggedInUserFriends = z.object({
    query: z.object({
        requestStatus: z.enum(
            [
                FRIEND_REQUEST_STATUS.ACCEPTED,
                FRIEND_REQUEST_STATUS.PENDING,
                FRIEND_REQUEST_STATUS.REJECTED,
            ],
            { required_error: "Required" },
        ),
        type: z.enum(["from", "to"], { required_error: "Required" }),
    }),
});

export const updateFriendRequestStatus = z.object({
    body: z.object({
        requestStatus: z.enum(
            [
                FRIEND_REQUEST_STATUS.ACCEPTED,
                FRIEND_REQUEST_STATUS.PENDING,
                FRIEND_REQUEST_STATUS.REJECTED,
            ],
            { required_error: "Required" },
        ),
        friendId: z
            .string({ required_error: "Required" })
            .refine((val) => Types.ObjectId.isValid(val), {
                message: "Invalid 'friendId'",
            }),
    }),
});

export const searchFriendByUsernameOrUserIdSchema = z.object({
    query: z.object({
        queryText: z
            .string({ required_error: "Required" })
            .min(2, "Too short")
            .max(256, "Too long"),
    }),
});

// ====================================
// Types
// ====================================

export type SendFriendRequest = z.infer<typeof sendFriendRequest>;
export type GetLoggedInUserFriends = z.infer<typeof getLoggedInUserFriends>;
export type UpdateFriendRequestStatus = z.infer<
    typeof updateFriendRequestStatus
>;
export type SearchFriendByUsernameOrUserId = z.infer<
    typeof searchFriendByUsernameOrUserIdSchema
>;
