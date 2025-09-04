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

export type supplyToNaviType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type withdrawFromNaviType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type claimFromNaviType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type claimFromNaviAndResupplyType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type supplyToScallopType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type withdrawFromScallopType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[],
    marketTypes: string[],
    withdrawValues: number[]
}

export type supplyToSuiLendType = {
    type: string,
    coinTypes: string[],
    names: string[],
    decimals: number[],
    values: number[]
}

export type transactionType = (transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType)[];

function isTransferType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is transferType {
    return type.type === "transfer";
}

function isSupplyToNaviType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is supplyToNaviType {
    return type.type === "supplyToNavi";
}

function isWithdrawFromNaviType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is withdrawFromNaviType {
    return type.type === "withdrawFromNavi";
}

function isClaimFromNaviType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is claimFromNaviType {
    return type.type === "claimFromNavi";
}

function isClaimFromNaviAndResupplyType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is claimFromNaviAndResupplyType {
    return type.type === "claimFromNaviAndResupply";
}

function isSupplyToScallopType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is supplyToScallopType {
    return type.type === "supplyToScallop";
}

function isWithdrawFromScallopType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is withdrawFromScallopType {
    return type.type === "withdrawFromScallop";
}

function isSupplyToSuiLendType(type: transferType | supplyToNaviType | withdrawFromNaviType | claimFromNaviType | claimFromNaviAndResupplyType | supplyToScallopType | withdrawFromScallopType | supplyToSuiLendType): type is supplyToSuiLendType {
    return type.type === "supplyToSuiLend";
}

export const typeToInfo = new Map<string, {
    src: string,
    alt: string,
    fallback: string
}>;
typeToInfo.set("transfer", {
    src: "/sui.png",
    alt: "sui logo",
    fallback: "Sui"
});
typeToInfo.set("supplyToNavi", {
    src: "/navx.png",
    alt: "navi logo",
    fallback: "Navi"
});
typeToInfo.set("withdrawFromNavi", {
    src: "/navx.png",
    alt: "navi logo",
    fallback: "Navi"
});
typeToInfo.set("claimFromNavi", {
    src: "/navx.png",
    alt: "navi logo",
    fallback: "Navi"
});
typeToInfo.set("claimFromNaviAndResupply", {
    src: "/navx.png",
    alt: "navi logo",
    fallback: "Navi"
});
typeToInfo.set("supplyToScallop", {
    src: "/scallop.png",
    alt: "scallop logo",
    fallback: "Scallop"
});
typeToInfo.set("withdrawFromScallop", {
    src: "/scallop.png",
    alt: "scallop logo",
    fallback: "Scallop"
});
typeToInfo.set("supplyToSuiLend", {
    src: "/suiLend.png",
    alt: "SuiLend logo",
    fallback: "SuiLend"
});

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
            if (isTransferType(transaction) || isSupplyToNaviType(transaction) || isSupplyToScallopType(transaction) || isSupplyToSuiLendType(transaction)) {
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
            if (isWithdrawFromNaviType(transaction) || isWithdrawFromScallopType(transaction)) {
                transaction.coinTypes.forEach((type, index) => {
                    const value = !isWithdrawFromScallopType(transaction) ? transaction.values[index] : transaction.withdrawValues[index];
                    const coinIndex = coins.findIndex(coin => coin.coinType === type);
                    if (coinIndex === -1) {
                        if (value !== 0)
                            coins.push({
                                coinType: type,
                                name: transaction.names[index],
                                decimals: transaction.decimals[index],
                                value: value
                            });
                    } else {
                        coins[coinIndex] = {
                            coinType: coins[coinIndex].coinType,
                            name: coins[coinIndex].name,
                            decimals: coins[coinIndex].decimals,
                            value: coins[coinIndex].value + value
                        };
                    }
                });
            }
            // if (isClaimFromNaviType(transaction)) {
            //     transaction.coinTypes.forEach((type, index) => {
            //         const value = transaction.values[index];
            //         const coinIndex = coins.findIndex(coin => coin.coinType === type);
            //         if (coinIndex === -1) {
            //             if (value !== 0)
            //                 coins.push({
            //                     coinType: type,
            //                     name: transaction.names[index],
            //                     decimals: transaction.decimals[index],
            //                     value: value * transaction.decimals[index]
            //                 });
            //         } else {
            //             coins[coinIndex] = {
            //                 coinType: coins[coinIndex].coinType,
            //                 name: coins[coinIndex].name,
            //                 decimals: coins[coinIndex].decimals,
            //                 value: coins[coinIndex].value + value * coins[coinIndex].decimals
            //             };
            //         }
            //     });
            // }
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
    updateTransactionsInfo,
    isTransferType,
    isSupplyToNaviType,
    isWithdrawFromNaviType,
    isClaimFromNaviType,
    isClaimFromNaviAndResupplyType,
    isSupplyToScallopType,
    isWithdrawFromScallopType,
    isSupplyToSuiLendType,
};

export default txStore.reducer;