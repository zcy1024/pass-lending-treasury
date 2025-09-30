'use client'

import { createSlice } from "@reduxjs/toolkit";

export type UserInfoType = {
    hadInviter: boolean,
    code: string,
    invited: number,
    reward: number,
    points: number
}

const initialState: UserInfoType = {
    hadInviter: false,
    code: "",
    invited: 0,
    reward: 0,
    points: 0
}

const leaderboardStore = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        setUserInfo(state, action: { payload: UserInfoType }) {
            state = action.payload;
        }
    }
});

const { setUserInfo } = leaderboardStore.actions;

export { setUserInfo };

export default leaderboardStore.reducer;