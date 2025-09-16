import { getLendingState } from "@naviprotocol/lending";
import { withdrawCoinType } from "@/store/modules/navi";

type stateType = {
    pool: {
        token: {
            coinType: string,
            logoUri: string,
            symbol: string,
            decimals: number
        },
    }
    supplyBalance: string
}

export default async function getNaviLendingState(address: string) {
    const state = (await getLendingState(address)) as unknown as stateType[];
    return state.map(item => {
        return {
            coinType: item.pool.token.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : item.pool.token.coinType,
            name: item.pool.token.symbol,
            src: item.pool.token.logoUri,
            alt: item.pool.token.symbol,
            fallback: item.pool.token.symbol,
            supplied: Number(item.supplyBalance) * (10 ** (item.pool.token.decimals - 9))
        } as withdrawCoinType;
    })
}