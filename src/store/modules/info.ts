'use client'

import { createSlice, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { randomTwentyFive } from "@/lib/utils";
import { getPasskeyKeypair } from "@/configs/passkey";

export type coinType = {
    name: string,
    value: number,
    transferValue?: string
}

type initialStateType = {
    address: string,
    coins: coinType[],
    transferList: coinType[],
    newCoins: coinType[],
    realCoins: coinType[],
    navTab: string,
    progressValue: number
}

const initialState: initialStateType = {
    address: "",
    coins: [],
    transferList: [],
    newCoins: [],
    realCoins: [],
    navTab: "Supply",
    progressValue: 0
}

const infoStore = createSlice({
    name: "info",
    initialState,
    reducers: {
        setAddress(state, action: { payload: string }) {
            state.address = action.payload;
        },
        setCoins(state, action: { payload: coinType[] }) {
            state.coins = action.payload;
            state.realCoins = calcRealCoins(state.coins, state.newCoins);
        },
        setTransferList(state, action: { payload: coinType[] }) {
            state.transferList = action.payload;
        },
        setNewCoins(state, action: { payload: coinType[] }) {
            state.newCoins = action.payload;
            state.realCoins = calcRealCoins(state.coins, state.newCoins);
        },
        setNavTab(state, action: { payload: string }) {
            state.navTab = action.payload;
        },
        setProgressValue(state, action: { payload: number }) {
            state.progressValue = action.payload;
        }
    }
});

const initProgress = () => {
    return (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        let basicValue = 25;
        const intervalTimer = setInterval(() => {
            const targetValue = basicValue === 75 ? 100 : basicValue + randomTwentyFive();
            basicValue += 25;
            dispatch(setProgressValue(targetValue));
            if (targetValue >= 100)
                clearInterval(intervalTimer);
        }, 1000);
    }
}

const calcRealCoins = (coins: coinType[], newCoins: coinType[]) => {
    let temp: coinType[] = [];
    temp = temp.concat(coins.map(coin => {
        const index = newCoins.findIndex(newCoin => coin.name === newCoin.name);
        return index === -1 ? coin : newCoins[index];
    }))
    temp = temp.concat(newCoins.filter(newCoin => coins.findIndex(coin => coin.name === newCoin.name) === -1));
    return temp;
}

const refreshAll = (publicKeyBytes: Uint8Array | undefined) => {
    return async (dispatch: ThunkDispatch<{
        info: initialStateType
    }, undefined, UnknownAction> & Dispatch<UnknownAction>) => {
        if (publicKeyBytes) {
            const keypair = getPasskeyKeypair(window.location.hostname, publicKeyBytes);
            const address = keypair.toSuiAddress();
            dispatch(setAddress(address));
            return;
        }
        dispatch(setAddress(""));
    }
}

const {
    setAddress,
    setCoins,
    setTransferList,
    setNewCoins,
    setNavTab,
    setProgressValue
} = infoStore.actions;

export {
    setAddress,
    setCoins,
    setTransferList,
    setNewCoins,
    setNavTab,
    setProgressValue
};

export {
    initProgress,
    calcRealCoins,
    refreshAll,
}

export default infoStore.reducer;