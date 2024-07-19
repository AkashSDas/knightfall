import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

export type FriendsChatState = {
    isSidebarOpen: boolean;
    mainContent:
        | { type: "search" }
        | { type: "blocked" }
        | { type: "friendRequests" }
        | { type: "chat"; friendId: string }
        | { type: "friends" };
};

const initialState: FriendsChatState = {
    isSidebarOpen: true,
    mainContent: { type: "friends" },
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
