'use client'

import { createSlice } from "@reduxjs/toolkit";
import { supplyCoinType, withdrawCoinType } from "@/store/modules/navi";

type initialStateType = {
    title: string,
    coins: supplyCoinType[],
    withdrawCoins: withdrawCoinType[]
}

const initialState: initialStateType = {
    title: "SuiLend",
    coins: [],
    withdrawCoins: []
}

const suiLendStore = createSlice({
    name: "suiLend",
    initialState,
    reducers: {
        setSuiLendSupplyCoins(state, action: { payload: supplyCoinType[] }) {
            state.coins = action.payload;
        },
        setSuiLendWithdrawCoins(state, action: { payload: withdrawCoinType[] }) {
            state.withdrawCoins = action.payload;
        }
    }
});

const {
    setSuiLendSupplyCoins,
    setSuiLendWithdrawCoins
} = suiLendStore.actions;

export {
    setSuiLendSupplyCoins,
    setSuiLendWithdrawCoins
}

export default suiLendStore.reducer;