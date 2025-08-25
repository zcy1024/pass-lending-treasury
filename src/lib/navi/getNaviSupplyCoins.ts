import { getPool } from "@naviprotocol/lending";
import { supplyCoinType } from "@/store/modules/navi";

const coinTypes = [
    "0x2::sui::SUI",
    "0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX",
    "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL",
    "0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP",
    "0x5145494a5f5100e645e4b0aa950fa6b68f614e8c59e17bc5ded3495123a79178::ns::NS"
];

type poolType = {
    supplyIncentiveApyInfo: {
        apy: string
    },
    token: {
        coinType: string,
        logoUri: string,
        symbol: string
    }
}

export default async function getNaviSupplyCoins() {
    const pools: poolType[] = [];
    for (const coinType of coinTypes)
        pools.push(await getPool(coinType) as unknown as poolType);
    return pools.map(pool => {
        return {
            coinType: pool.token.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : pool.token.coinType,
            name: pool.token.symbol,
            src: pool.token.logoUri,
            alt: pool.token.symbol,
            fallback: pool.token.symbol,
            apr: Number(pool.supplyIncentiveApyInfo.apy)
        } as supplyCoinType;
    });
}