import { BucketClient } from 'bucket-protocol-sdk';
import { network, suiClient } from "@/configs/networkConfig";
import { getUrlInMetadata } from "@/lib/utils";
import { supplyCoinType } from "@/store/modules/navi";

export default async function getBucketSupplyCoins() {
    const client = new BucketClient({
        // @ts-expect-error suiClient
        suiClient,
        network
    });
    const usdbType = client.getUsdbCoinType();
    const url = await getUrlInMetadata(usdbType);
    const lpType = "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";
    const savingPoolInfos = await client.getAllSavingPoolObjects();
    const info = savingPoolInfos[lpType];
    const rewardRate = info.rewardRate["0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"];
    return [{
        coinType: usdbType,
        name: "USDB",
        src: url,
        alt: "USDB",
        fallback: "USDB",
        apr: rewardRate
    } as supplyCoinType];
}