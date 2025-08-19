import { suiClient } from "@/configs/networkConfig";
import { coinType } from "@/store/modules/info";

export async function getCoins(owner: string) {
    const coins: coinType[] = [];
    const balances = await suiClient.getAllBalances({
        owner,
    });
    for (const balance of balances) {
        const metadata = await suiClient.getCoinMetadata({
            coinType: balance.coinType
        });
        if (!metadata)
            continue;
        coins.push({
            coinType: balance.coinType,
            name: metadata.name,
            decimals: 10 ** metadata.decimals,
            value: Number(balance.totalBalance),
        });
    }
    return coins;
}