'use client'

import { createSlice, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { randomTwentyFive } from "@/lib/utils";
import { getPasskeyKeypair } from "@/configs/passkey";
import { getCoins } from "@/lib/coinInfo";

export type coinType = {
    coinType: string,
    name: string,
    decimals: number,
    value: number
}

type initialStateType = {
    address: string,
    publicKeyArray: number[],
    coins: coinType[],
    newCoins: coinType[],
    realCoins: coinType[],
    navTab: string,
    progressValue: number
}

const initialState: initialStateType = {
    address: "",
    publicKeyArray: [],
    coins: [],
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
        setPublicKeyArray(state, action: { payload: number[] }) {
            state.publicKeyArray = action.payload;
        },
        setCoins(state, action: { payload: coinType[] }) {
            state.coins = action.payload;
            state.realCoins = calcRealCoins(state.coins, state.newCoins);
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
        const index = newCoins.findIndex(newCoin => coin.coinType === newCoin.coinType);
        return index === -1 ? coin : newCoins[index];
    }))
    temp = temp.concat(newCoins.filter(newCoin => coins.findIndex(coin => coin.coinType === newCoin.coinType) === -1));
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
            dispatch(setPublicKeyArray(Array.from(publicKeyBytes)));
            dispatch(setNewCoins([]));
            dispatch(setCoins(await getCoins(address)));
            return;
        }
        dispatch(setAddress(""));
        dispatch(setPublicKeyArray([]));
        dispatch(setNewCoins([]));
        dispatch(setCoins([]));
    }
}

const {
    setAddress,
    setPublicKeyArray,
    setCoins,
    setNewCoins,
    setNavTab,
    setProgressValue
} = infoStore.actions;

export {
    setAddress,
    setPublicKeyArray,
    setCoins,
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