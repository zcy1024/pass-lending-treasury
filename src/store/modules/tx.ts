'use client'

import { createSlice, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { coinType, setNewCoins } from "@/store/modules/info";

export type transferType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[],
    receipt: string
}

export type transactionType = (transferType)[];

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

const updateNewCoins = (coins: coinType[], transactions: transactionType): [boolean, coinType[]] => {
    try {
        transactions.forEach(transaction => {
            if (transaction.type === "transfer") {
                transaction.coinTypes.forEach((type, index) => {
                    const value = transaction.values[index];
                    const coinIndex = coins.findIndex(coin => coin.coinType === type);
                    if (coinIndex === -1 || coins[coinIndex].value < value)
                        throw Error();
                    coins[coinIndex] = {
                        coinType: coins[coinIndex].coinType,
                        name: coins[coinIndex].name,
                        decimals: coins[coinIndex].decimals,
                        value: coins[coinIndex].value - value
                    };
                });
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return [false, []];
    }
    return [true, coins];
}

const updateTransactionsInfo = (coins: coinType[], transactions: transactionType) => {
    return (dispatch: ThunkDispatch<{
        tx: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        const [isValid, newCoins] = updateNewCoins(coins.concat([]), transactions);
        if (!isValid)
            return false;
        dispatch(setNewCoins(newCoins));
        dispatch(setTransactions(transactions));
        return true;
    }
}

const {
    setTransactions
} = txStore.actions;

export {
    setTransactions
};

export {
    updateNewCoins,
    updateTransactionsInfo
};

export default txStore.reducer;