import { type ValueOf } from "./types";

/** Reaction to a message in DMs. */
export const MESSAGE_REACT_TYPE = {
    LIKE: "like",
    DISLIKE: "dislike",
    LAUGH: "laugh",
    SAD: "sad",
    ANGRY: "angry",
} as const;

/** Reaction to a message in DMs. */
export type MessageReactType = ValueOf<typeof MESSAGE_REACT_TYPE>;
