// Use throughout your app instead of plain `useDispatch` and `useSelector`

import { AppDispatch, RootState } from "../store";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

// https://github.com/microsoft/TypeScript/issues/42873
// https://github.com/reduxjs/redux-toolkit/issues/3962
// Same as frontend/src/store/index.ts `store` issue
// Here this issue is faced by `useAppDispatch`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as _Redux from "@reduxjs/toolkit";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
