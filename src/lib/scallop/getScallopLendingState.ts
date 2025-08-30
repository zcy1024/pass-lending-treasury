import { Scallop } from "@scallop-io/sui-scallop-sdk";
import { suiClient } from "@/configs/networkConfig";
import { supplyCoinType } from "@/store/modules/navi";

async function getUrlInMetadata(coinType: string) {
    const res = await suiClient.getCoinMetadata({
        coinType
    });
    return res && res.iconUrl ? res.iconUrl : "";
}

export default async function getScallopLendingState(coinNameAndUrl: {
    coinType: string,
    src: string
}[]) {
    const sdk = new Scallop({});
    const query = await sdk.createScallopQuery();
    const coinNames = ["sui", "sca", "wal", "deep", "ns"];
    const pools = await query.getMarketPools(coinNames);
    const ret: supplyCoinType[] = [];
    for (const name of coinNames) {
        const pool = pools.pools[name]!;
        const coinType = pool.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : pool.coinType;
        const nameToUrl = coinNameAndUrl.find(item => item.coinType === coinType);
        ret.push({
            coinType,
            name: pool.symbol,
            src: nameToUrl ? nameToUrl.src : await getUrlInMetadata(pool.coinType),
            alt: pool.symbol,
            fallback: pool.symbol,
            apr: Math.round(Number(pool.supplyApr) * 10000) / 100
        });
    }
    return ret;
}