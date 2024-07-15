import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

type FriendsChatState = {
    isSidebarOpen: boolean;
};

const initialState: FriendsChatState = {
    isSidebarOpen: true,
};

export const friendsChatSlice = createSlice({
    name: "friendsChat",
    initialState,
    reducers: {
        setSidebarOpen(state, action: { payload: boolean }) {
            state.isSidebarOpen = action.payload;
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
