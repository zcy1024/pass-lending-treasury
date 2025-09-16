import { initializeSuilend, LENDING_MARKET_ID, LENDING_MARKET_TYPE, SuilendClient } from "@suilend/sdk";
import { suiClient } from "@/configs/networkConfig";
import { withdrawCoinType } from "@/store/modules/navi";
import { getUrlInMetadata } from "@/lib/utils";

type TokenType = {
    coinType: string,
    amount: number,
    symbol: string
}

export default async function getSuiLendLendingState(address: string, coinNameAndUrl: {
    coinType: string,
    src: string
}[]) {
    // get cTokens in obligation
    const obligationOwnerCaps = await SuilendClient.getObligationOwnerCaps(
        address,
        [LENDING_MARKET_TYPE],
        suiClient
    );
    if (obligationOwnerCaps.length === 0)
        return [];
    const obligationOwnerCap = obligationOwnerCaps[0];
    const obligation = await SuilendClient.getObligation(
        obligationOwnerCap.obligationId,
        [LENDING_MARKET_TYPE],
        suiClient
    );
    const cTokens = obligation.deposits.map(item => {
        return {
            coinType: "0x" + item.coinType.name,
            amount: Number(item.depositedCtokenAmount.toString()),
            symbol: ""
        } as TokenType;
    });
    // console.log(cTokens);
    // get c token exchange rate
    const suiLendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient
    );
    const {
        // lendingMarket,
        // coinMetadataMap,
        //
        // refreshedRawReserves,
        reserveMap,
        // reserveCoinTypes,
        // reserveCoinMetadataMap,
        //
        // rewardCoinTypes,
        // activeRewardCoinTypes,
        // rewardCoinMetadataMap,
    } = await initializeSuilend(suiClient, suiLendClient);
    // console.log(reserveMap);
    // exchange c token to source token
    const tokens = cTokens.map(item => {
        const rate = reserveMap[item.coinType].cTokenExchangeRate.toNumber();
        const symbol = reserveMap[item.coinType].symbol;
        return {
            coinType: item.coinType,
            amount: item.amount * rate,
            symbol
        } as TokenType;
    });
    // console.log(tokens);
    const ret: withdrawCoinType[] = [];
    for (const token of tokens) {
        const coinType = token.coinType  === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : token.coinType;
        const nameToUrl = coinNameAndUrl.find(item => item.coinType === coinType);
        ret.push({
            coinType: coinType,
            name: token.symbol,
            src: nameToUrl ? nameToUrl.src : await getUrlInMetadata(token.coinType),
            alt: token.symbol,
            fallback: token.symbol,
            supplied: Math.floor(token.amount)
        });
    }
    return ret;
}