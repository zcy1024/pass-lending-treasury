'use client'

import { createSlice, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { randomTwentyFive } from "@/lib/utils";

type coinType = {
    name: string,
    value: number,
    transferValue?: string
}

type initialStateType = {
    coins: coinType[],
    transferList: coinType[],
    navTab: string,
    progressValue: number
}

const initialState: initialStateType = {
    coins: [
        {
            name: "Sui",
            value: 1000000000
        },
        {
            name: "NAVX",
            value: 100
        },
        {
            name: "SCALLOP",
            value: 999
        },
        {
            name: "BUCK",
            value: 987654
        }
    ],
    transferList: [],
    navTab: "Supply",
    progressValue: 0
}

const infoStore = createSlice({
    name: "info",
    initialState,
    reducers: {
        setCoins(state, action: { payload: coinType[] }) {
            state.coins = action.payload;
        },
        setTransferList(state, action: { payload: coinType[] }) {
            state.transferList = action.payload;
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

const {
    setCoins,
    setTransferList,
    setNavTab,
    setProgressValue
} = infoStore.actions;

export {
    setCoins,
    setTransferList,
    setNavTab,
    setProgressValue
};

export {
    initProgress
}

export default infoStore.reducer;