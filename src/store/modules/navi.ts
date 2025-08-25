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
    supplied: number
}

export type rewardCoinType = {
    coinType: string,
    name: string,
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
    withdrawCoins: [
        {
            coinType: "coinType1",
            name: "Sui",
            supplied: 1000000000
        },
        {
            coinType: "coinType2",
            name: "NAVX",
            supplied: 987654
        },
        {
            coinType: "coinType3",
            name: "SCALLOP",
            supplied: 126498
        },
        {
            coinType: "coinType4",
            name: "BUCK",
            supplied: 6549751
        }
    ],
    rewardCoins: [
        {
            coinType: "coinType1",
            name: "Sui",
            reward: 1000000000
        },
        {
            coinType: "coinType2",
            name: "NAVX",
            reward: 987654
        },
        {
            coinType: "coinType3",
            name: "SCALLOP",
            reward: 126498
        },
        {
            coinType: "coinType4",
            name: "BUCK",
            reward: 6549751
        }
    ]
}

const naviStore = createSlice({
    name: "navi",
    initialState,
    reducers: {
        setNaviSupplyCoins(state, action: { payload: supplyCoinType[] }) {
            state.coins = action.payload;
        }
    }
});

const {
    setNaviSupplyCoins,
} = naviStore.actions;

export {
    setNaviSupplyCoins,
}

export default naviStore.reducer;