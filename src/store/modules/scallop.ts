'use client'

import { createSlice } from "@reduxjs/toolkit";
import { supplyCoinType, withdrawCoinType } from "@/store/modules/navi";

type initialStateType = {
    title: string,
    coins: supplyCoinType[],
    withdraw: withdrawCoinType[]
}

const initialState: initialStateType = {
    title: "Scallop",
    coins: [],
    withdraw: []
}

const scallopStore = createSlice({
    name: "scallop",
    initialState,
    reducers: {
        setScallopSupplyCoins(state, action: { payload: supplyCoinType[] }) {
            state.coins = action.payload;
        },
        setScallopWithdrawCoins(state, action: { payload: withdrawCoinType[] }) {
            state.withdraw = action.payload;
        }
    }
});

const {
    setScallopSupplyCoins,
    setScallopWithdrawCoins
} = scallopStore.actions;

export {
    setScallopSupplyCoins,
    setScallopWithdrawCoins
}

export default scallopStore.reducer;