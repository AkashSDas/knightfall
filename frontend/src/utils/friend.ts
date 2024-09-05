import { type ValueOf } from "./types";

export const FRIEND_REQUEST_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
} as const;

export type FriendRequestStatus = ValueOf<typeof FRIEND_REQUEST_STATUS>;
