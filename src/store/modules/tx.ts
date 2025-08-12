'use client'

import { createSlice } from "@reduxjs/toolkit";

export type transferType = {
    type: string,
    name: string,
    value: number,
    receipt: string
}

type transactionType = (transferType)[];

type initialStateType = {
    transactions: transactionType
}

const initialState: initialStateType = {
    transactions: []
}

const txStore = createSlice({
    name: "tx",
    initialState,
    reducers: {
        setTransactions(state, action: { payload: transactionType }) {
            state.transactions = action.payload
        }
    }
});

const {
    setTransactions
} = txStore.actions;

export {
    setTransactions
};

export default txStore.reducer;