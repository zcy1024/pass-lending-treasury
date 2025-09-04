import {
    initializeSuilend,
    LENDING_MARKET_ID,
    LENDING_MARKET_TYPE, linearlyInterpolate,
    SuilendClient
} from "@suilend/sdk";
import { suiClient } from "@/configs/networkConfig";
import BigNumber from "bignumber.js";
import { supplyCoinType } from "@/store/modules/navi";

const coinTypes = [
    "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    "0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068::usdt::USDT",
    "0xb7844e289a8410e50fb3ca48d69eb9cf29e27d223ef90353fe1bd8e27ff8f3f8::coin::COIN"
];


function calculateUtilizationPercent(depositAmount: BigNumber, borrowAmount: BigNumber) {
    return depositAmount.eq(0) ? new BigNumber(0) : borrowAmount.div(depositAmount).times(100);
}

function calculateBorrowAprPercent(depositAmount: BigNumber, borrowAmount: BigNumber, interestRate: {
    id: string
    utilPercent: BigNumber
    aprPercent: BigNumber
}[]) {
    const utilizationPercent = calculateUtilizationPercent(depositAmount, borrowAmount);
    if (utilizationPercent.gt(100))
        return undefined;
    return linearlyInterpolate(
        interestRate,
        "utilPercent",
        "aprPercent",
        utilizationPercent
    );
}

function calculateDepositAprPercent(
    depositAmount: BigNumber,
    borrowAmount: BigNumber,
    interestRate: {
        id: string
        utilPercent: BigNumber
        aprPercent: BigNumber
    }[],
    spreadFeeBps: number
) {
    const utilizationPercent = calculateUtilizationPercent(depositAmount, borrowAmount);
    const borrowAprPercent = calculateBorrowAprPercent(depositAmount, borrowAmount, interestRate);
    if (!borrowAprPercent || utilizationPercent.gt(100))
        return undefined;
    return new BigNumber(utilizationPercent.div(100))
        .times(borrowAprPercent.div(100))
        .times(1 - spreadFeeBps / 10000)
        .times(100);
}

export default async function getSuiLendSupplyCoins(coinNameAndUrl: {
    coinType: string,
    src: string
}[]) {
    const suiLendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient
    );
    const {
        lendingMarket,
        // coinMetadataMap,
        //
        // refreshedRawReserves,
        // reserveMap,
        // reserveCoinTypes,
        // reserveCoinMetadataMap,
        //
        // rewardCoinTypes,
        // activeRewardCoinTypes,
        // rewardCoinMetadataMap,
    } = await initializeSuilend(suiClient, suiLendClient);
    // const { rewardPriceMap } = await initializeSuilendRewards(
    //     reserveMap,
    //     activeRewardCoinTypes,
    // );
    const reserves = lendingMarket.reserves.filter(reserve => coinTypes.find(type => type === reserve.coinType) !== undefined);
    const ret: supplyCoinType[] = [];
    for (const reserve of reserves) {
        const coinType = reserve.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : reserve.coinType;
        const nameToUrl = coinNameAndUrl.find(item => item.coinType === coinType);
        const apr = calculateDepositAprPercent(
            reserve.depositedAmount,
            reserve.borrowedAmount,
            reserve.config.interestRate,
            reserve.config.spreadFeeBps
        );
        ret.push({
            coinType,
            name: reserve.symbol,
            src: nameToUrl ? nameToUrl.src : reserve.iconUrl!,
            alt: reserve.symbol,
            fallback: reserve.symbol,
            apr: apr ? Number(apr.toFixed(2)) : 0
        });
    }
    return ret;
}