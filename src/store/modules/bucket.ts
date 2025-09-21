'use client'

import { createSlice } from "@reduxjs/toolkit";
import { rewardCoinType, supplyCoinType, withdrawCoinType } from "@/store/modules/navi";

type initialStateType = {
    title: string,
    coins: supplyCoinType[],
    withdrawCoins: withdrawCoinType[],
    rewardCoins: rewardCoinType[]
}

const initialState: initialStateType = {
    title: "Bucket",
    coins: [],
    withdrawCoins: [],
    rewardCoins: []
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
        },
        setBucketRewardCoins(state, action: { payload: rewardCoinType[] }) {
            state.rewardCoins = action.payload;
        }
    }
});

const {
    setBucketSupplyCoins,
    setBucketWithdrawCoins,
    setBucketRewardCoins
} = bucketStore.actions;

export {
    setBucketSupplyCoins,
    setBucketWithdrawCoins,
    setBucketRewardCoins
}

export default bucketStore.reducer;