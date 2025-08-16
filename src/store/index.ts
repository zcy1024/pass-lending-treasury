'use client'

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import infoReducer from "@/store/modules/info";
import txReducer from "@/store/modules/tx";
import naviReducer from "@/store/modules/navi";

const store = configureStore({
    reducer: {
        info: infoReducer,
        tx: txReducer,
        navi: naviReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;