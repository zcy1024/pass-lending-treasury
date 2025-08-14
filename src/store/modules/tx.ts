'use client'

import { createSlice } from "@reduxjs/toolkit";

export type transferType = {
    type: string,
    names: string[],
    values: number[],
    receipt: string
}

type transactionType = (transferType)[];

export const typeToInfo = new Map<string, {
    src: string,
    alt: string,
    fallback: string
}>;
typeToInfo.set("transfer", {
    src: "/sui.png",
    alt: "sui logo",
    fallback: "Sui"
})

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