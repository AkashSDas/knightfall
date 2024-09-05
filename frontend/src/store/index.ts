// https://github.com/microsoft/TypeScript/issues/42873
// https://github.com/reduxjs/redux-toolkit/issues/3962
// Here the issue is faced by `store`
import type * as _Redux from "@reduxjs/toolkit";
import {
    type ThunkAction,
    type UnknownAction,
    configureStore,
} from "@reduxjs/toolkit";

import { friendsChatSlice } from "./friends-chat/slice";
import { matchSlice } from "./match/slice";

export const store = configureStore({
    reducer: {
        friendsChat: friendsChatSlice.reducer,
        match: matchSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    UnknownAction
>;
