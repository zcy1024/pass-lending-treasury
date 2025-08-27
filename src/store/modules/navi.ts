'use client'

import { createSlice } from "@reduxjs/toolkit";

export type supplyCoinType = {
    coinType: string,
    name: string,
    src: string,
    alt: string,
    fallback: string,
    apr: number
}

export type withdrawCoinType = {
    coinType: string,
    name: string,
    src: string,
    alt: string,
    fallback: string,
    supplied: number
}

export type rewardCoinType = {
    coinType: string,
    name: string,
    src: string,
    alt: string,
    fallback: string,
    reward: number
}

type initialStateType = {
    title: string,
    coins: supplyCoinType[],
    withdrawCoins: withdrawCoinType[],
    rewardCoins: rewardCoinType[]
}

const initialState: initialStateType = {
    title: "NAVI Protocol",
    coins: [],
    withdrawCoins: [],
    rewardCoins: []
}

const naviStore = createSlice({
    name: "navi",
    initialState,
    reducers: {
        setNaviSupplyCoins(state, action: { payload: supplyCoinType[] }) {
            state.coins = action.payload;
        },
        setNaviWithdrawCoins(state, action: { payload: withdrawCoinType[] }) {
            state.withdrawCoins = action.payload;
        },
        setNaviRewardCoins(state, action:{ payload: rewardCoinType[] }) {
            state.rewardCoins = action.payload;
        }
    }
});

const {
    setNaviSupplyCoins,
    setNaviWithdrawCoins,
    setNaviRewardCoins
} = naviStore.actions;

export {
    setNaviSupplyCoins,
    setNaviWithdrawCoins,
    setNaviRewardCoins
}

export default naviStore.reducer;