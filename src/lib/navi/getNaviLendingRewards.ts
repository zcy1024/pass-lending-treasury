import { getPool, getUserAvailableLendingRewards, summaryLendingRewards } from "@naviprotocol/lending";
import { rewardCoinType } from "@/store/modules/navi";

type poolType = {
    token: {
        coinType: string,
        logoUri: string,
        symbol: string
    }
}

export default async function getNaviLendingRewards(address: string) {
    const ret: rewardCoinType[] = [];
    const rewards = summaryLendingRewards(await getUserAvailableLendingRewards(address));
    for (const outer of rewards) {
        for (const reward of outer.rewards) {
            const type = reward.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : reward.coinType;
            const amount = reward.available;
            const idx = ret.findIndex(item => item.coinType === type);
            if (idx === -1) {
                const pool = await getPool(type) as unknown as poolType;
                ret.push({
                    coinType: type,
                    name: pool.token.symbol,
                    src: pool.token.logoUri,
                    alt: pool.token.symbol,
                    fallback: pool.token.symbol,
                    reward: 0
                });
            }
            ret[idx !== -1 ? idx : ret.length - 1].reward += Number(amount);
        }
    }
    return ret;
}