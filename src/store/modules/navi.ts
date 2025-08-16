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
            name: "Navx",
            src: "/navx.png",
            alt: "navx logo",
            fallback: "Navx",
            apr: 44.44
        },
        {
            name: "Scallop",
            src: "/scallop.png",
            alt: "scallop logo",
            fallback: "Scallop",
            apr: 0.36
        },
        {
            name: "Buck",
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
            name: "Navx",
            supplied: 987654
        },
        {
            name: "Scallop",
            supplied: 126498
        },
        {
            name: "Buck",
            supplied: 6549751
        }
    ],
    rewardCoins: [
        {
            name: "Sui",
            reward: 1000000000
        },
        {
            name: "Navx",
            reward: 987654
        },
        {
            name: "Scallop",
            reward: 126498
        },
        {
            name: "Buck",
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