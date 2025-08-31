import { Scallop } from "@scallop-io/sui-scallop-sdk";
import { withdrawCoinType } from "@/store/modules/navi";
import { getUrlInMetadata } from "@/lib/utils";

export default async function getScallopUserState(address: string, coinNameAndUrl: {
    coinType: string,
    src: string
}[]) {
    const sdk = new Scallop({});
    const query = await sdk.createScallopQuery();
    const coinNames = ["sui", "sca", "wal", "deep", "ns"];
    const lendings = await query.getLendings(coinNames, address);
    const ret: withdrawCoinType[] = [];
    for (const name of coinNames) {
        const info = lendings[name];
        if (!info || info.availableWithdrawAmount === 0)
            continue;
        const coinType = info.coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" ? "0x2::sui::SUI" : info.coinType;
        const nameToUrl = coinNameAndUrl.find(item => item.coinType === coinType);
        ret.push({
            coinType,
            name: info.symbol,
            src: nameToUrl ? nameToUrl.src : await getUrlInMetadata(info.coinType),
            alt: info.symbol,
            fallback: info.symbol,
            supplied: info.unstakedMarketAmount,
            marketType: info.marketCoinType,
            withdrawAmount: info.availableWithdrawAmount
        } as withdrawCoinType);
    }
    return ret;
}