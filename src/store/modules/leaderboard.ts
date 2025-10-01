'use client'

import { createSlice } from "@reduxjs/toolkit";

export type UserInfoType = {
    address: string,
    hadInviter: boolean,
    code: string,
    invited: number,
    reward: number,
    points: number
}

type initialStateType = {
    info: UserInfoType,
    infos: UserInfoType[]
}

const initialState: initialStateType = {
    info: {
        address: "",
        hadInviter: false,
        code: "",
        invited: 0,
        reward: 0,
        points: 0
    },
    infos: []
}

const leaderboardStore = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        setUserInfo(state, action: { payload: UserInfoType }) {
            state.info = action.payload;
        },
        setInfoList(state, action: { payload: UserInfoType[] }) {
            state.infos = action.payload;
        }
    }
});

const { setUserInfo, setInfoList } = leaderboardStore.actions;

export { setUserInfo, setInfoList };

export default leaderboardStore.reducer;