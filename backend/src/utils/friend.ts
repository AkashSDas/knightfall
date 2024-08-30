import { type ValueOf } from "./types";

/** Status of friend request sent to another user. */
export const FRIEND_REQUEST_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
} as const;

/** Status of friend request sent to another user. */
export type FriendRequestStatus = ValueOf<typeof FRIEND_REQUEST_STATUS>;
