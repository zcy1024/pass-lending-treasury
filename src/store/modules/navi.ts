'use client'

import { createSlice } from "@reduxjs/toolkit";

export type supplyCoinType = {
    name: string,
    src: string,
    alt: string,
    fallback: string,
    apr: number
}

type initialStateType = {
    title: string,
    coins: supplyCoinType[]
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