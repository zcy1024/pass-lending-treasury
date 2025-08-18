'use client'

import { createSlice } from "@reduxjs/toolkit";

export type supplyCoinType = {
    name: string,
    src: string,
    alt: string,
    fallback: string,
    apr: number
}

export type withdrawCoinType = {
    name: string
    supplied: number
}

export type rewardCoinType = {
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
    coins: [
        {
            name: "Sui",
            src: "/sui.png",
            alt: "sui logo",
            fallback: "Sui",
            apr: 3.8
        },
        {
            name: "NAVX",
            src: "/navx.png",
            alt: "navx logo",
            fallback: "Navx",
            apr: 44.44
        },
        {
            name: "SCALLOP",
            src: "/scallop.png",
            alt: "scallop logo",
            fallback: "Scallop",
            apr: 0.36
        },
        {
            name: "BUCK",
            src: "/buck.png",
            alt: "buck logo",
            fallback: "Buck",
            apr: 10.6
        }
    ],
    withdrawCoins: [
        {
            name: "Sui",
            supplied: 1000000000
        },
        {
            name: "NAVX",
            supplied: 987654
        },
        {
            name: "SCALLOP",
            supplied: 126498
        },
        {
            name: "BUCK",
            supplied: 6549751
        }
    ],
    rewardCoins: [
        {
            name: "Sui",
            reward: 1000000000
        },
        {
            name: "NAVX",
            reward: 987654
        },
        {
            name: "SCALLOP",
            reward: 126498
        },
        {
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