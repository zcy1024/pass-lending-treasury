'use client'

import { createSlice } from "@reduxjs/toolkit";
import { supplyCoinType, withdrawCoinType } from "@/store/modules/navi";

type initialStateType = {
    title: string,
    coins: supplyCoinType[],
    withdrawCoins: withdrawCoinType[]
}

const initialState: initialStateType = {
    title: "Bucket",
    coins: [],
    withdrawCoins: []
}

const bucketStore = createSlice({
    name: "bucket",
    initialState,
    reducers: {
        setBucketSupplyCoins(state, action: { payload: supplyCoinType[] }) {
            state.coins = action.payload;
        },
        setBucketWithdrawCoins(state, action: { payload: withdrawCoinType[] }) {
            state.withdrawCoins = action.payload;
        }
    }
});

const {
    setBucketSupplyCoins,
    setBucketWithdrawCoins
} = bucketStore.actions;

export {
    setBucketSupplyCoins,
    setBucketWithdrawCoins
}

export default bucketStore.reducer;