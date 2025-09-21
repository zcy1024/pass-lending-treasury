import { BucketClient } from "bucket-protocol-sdk";
import { network, suiClient } from "@/configs/networkConfig";
import { getUrlInMetadata } from "@/lib/utils";
import { rewardCoinType, withdrawCoinType } from "@/store/modules/navi";

export default async function getBucketSavingPoolState(address: string, coinNameAndUrl: {
    coinType: string,
    src: string
}[]): Promise<[withdrawCoinType[], rewardCoinType[]]> {
    const client = new BucketClient({
        // @ts-expect-error suiClient
        suiClient,
        network
    });
    const lpType = "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";
    const url = await getUrlInMetadata(lpType);
    const rewardType = "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";
    const item = coinNameAndUrl.find(item => item.coinType === "0x2::sui::SUI");
    const rewardUrl = item ? item.src : await getUrlInMetadata(rewardType);
    const infos = await client.getUserSavings({ address });
    const info = infos[lpType];
    const withdrawCoins = [{
        coinType: lpType,
        name: "sUSDB",
        src: url,
        alt: "sUSDB",
        fallback: "sUSDB",
        supplied: Number(info.lpBalance)
    } as withdrawCoinType];
    const rewardCoins = [{
        coinType: "0x2::sui::SUI",
        name: "SUI",
        src: rewardUrl,
        alt: "SUI",
        fallback: "SUI",
        reward: Number(info.rewards[rewardType]),
        decimals: 10 ** 9
    } as rewardCoinType];
    return [withdrawCoins, rewardCoins];
}