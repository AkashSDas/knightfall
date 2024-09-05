import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { type DirectMessage } from "@/utils/schemas";

import { RootState } from "../";

type FriendChatMessageBlock = {
    groupId: string;
    userId: string;
    friendId: string;
    directMessageId: string;
    messages: {
        messageId: string;
        text: string;
        reactions: unknown[];
        createdAt: string;
        updatedAt: string;
    }[];
};

export type FriendsChatState = {
    isSidebarOpen: boolean;
    mainContent:
        | { type: "search" }
        | { type: "blocked" }
        | { type: "friendRequests" }
        | { type: "chat"; friendId: string }
        | { type: "friends" };
    friendChats: Record<string, FriendChatMessageBlock[]>; // key is friendId
};

const initialState: FriendsChatState = {
    isSidebarOpen: true,
    mainContent: { type: "friends" },
    friendChats: {},
};

export const friendsChatSlice = createSlice({
    name: "friendsChat",
    initialState,
    reducers: {
        setSidebarOpen(state, action: { payload: boolean }) {
            state.isSidebarOpen = action.payload;
        },
        setMainContent(
            state,
            action: { payload: FriendsChatState["mainContent"] }
        ) {
            state.mainContent = action.payload;
        },
        pushMessage(
            state,
            action: {
                payload: {
                    directMessageId: string;
                    friendId: string;
                    messageId: string;
                    senderUserId: string;
                    text: string;
                };
            }
        ) {
            // If there's no last group or the last group is not from the same user
            // or the last message was more than 1 minute ago, in that case create
            // a new group else add the message to the last group

            const { friendId, senderUserId } = action.payload;
            const msg = {
                messageId: action.payload.messageId,
                text: action.payload.text,
                reactions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const chat = state.friendChats[friendId];

            if (chat) {
                const lastGroup = chat[chat.length - 1];

                if (
                    !lastGroup ||
                    lastGroup.userId !== senderUserId ||
                    new Date().getTime() -
                        new Date(
                            lastGroup.messages[
                                lastGroup.messages.length - 1
                            ].createdAt
                        ).getTime() >
                        60 * 1000
                ) {
                    // add it in the start
                    state.friendChats[friendId].unshift({
                        groupId: uuidv4(),
                        userId: senderUserId,
                        friendId: friendId,
                        directMessageId: action.payload.directMessageId,
                        messages: [msg],
                    });
                } else {
                    lastGroup.messages.unshift(msg);
                    chat[chat.length - 1] = lastGroup;
                }
            } else {
                state.friendChats[friendId] = [
                    {
                        groupId: uuidv4(),
                        userId: senderUserId,
                        friendId: friendId,
                        directMessageId: action.payload.directMessageId,
                        messages: [msg],
                    },
                ];
            }
        },
        initialPopulateFriendChat(
            state,
            action: { payload: { messages: DirectMessage[]; friendId: string } }
        ) {
            const groups: FriendChatMessageBlock[] = [];

            let lastUserId: string | null = null;
            let lastCreatedAt: string | null = null;

            for (const dm of action.payload.messages) {
                const { friend, id, messages } = dm;

                if (messages.length > 0) {
                    // Messages inside DM's messages is in oldest to lastest (as messages
                    // are being pushed in it. While DM's are in last to oldest)
                    for (const message of messages.slice().reverse()) {
                        // Adding the first message OR f last user is not same as current
                        // user then create a new message group OR if the last message was
                        // a minute ago ... in all of these cases create a new block of chat

                        if (
                            !lastUserId ||
                            !lastCreatedAt ||
                            lastUserId !== message.user ||
                            new Date(lastCreatedAt).getTime() < 1000 * 60
                        ) {
                            lastUserId = message.user;
                            lastCreatedAt = message.createdAt;

                            groups.push({
                                groupId: uuidv4(),
                                userId: message.user,
                                directMessageId: id,
                                friendId: friend,
                                messages: [
                                    {
                                        messageId: message._id,
                                        createdAt: message.createdAt,
                                        updatedAt: message.updatedAt,
                                        reactions: message.reactions,
                                        text: message.text,
                                    },
                                ],
                            });
                        } else {
                            // For continuous chat append the message in the last group
                            groups[groups.length - 1].messages.push({
                                messageId: message._id,
                                createdAt: message.createdAt,
                                updatedAt: message.updatedAt,
                                reactions: message.reactions,
                                text: message.text,
                            });
                        }
                    }
                }
            }
            state.friendChats[action.payload.friendId] = groups;
        },
    },
});

export const friendsChatActions = friendsChatSlice.actions;

export const friendsChatSelectors = {
    selectSidebar(state: RootState) {
        return {
            isSidebarOpen: state.friendsChat.isSidebarOpen,
        };
    },
};
