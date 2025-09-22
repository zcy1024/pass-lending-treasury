import { Transaction } from "@mysten/sui/transactions";
import { BucketClient } from "bucket-protocol-sdk";
import { network, suiClient } from "@/configs/networkConfig";

export default async function assembleClaimFromBucketAndResupply(tx: Transaction, sender: string) {
    const client = new BucketClient({
        // @ts-expect-error suiClient
        suiClient,
        network
    });
    const lpType = "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";
    // @ts-expect-error Transaction
    const rewardCoins = client.buildClaimSavingRewardsTransaction(tx, {
        lpType
    });
    for (const i in rewardCoins) {
        const coin = rewardCoins[i];
        // @ts-expect-error Transaction
        const usdb = await client.buildPSMSwapInTransaction(tx, {
            coinType: "0x2::sui::SUI",
            inputCoinOrAmount: coin
        });
        // @ts-expect-error Transaction
        client.buildDepositToSavingPoolTransaction(tx, {
            lpType,
            address: sender,
            depositCoinOrAmount: usdb
        });
    }
}