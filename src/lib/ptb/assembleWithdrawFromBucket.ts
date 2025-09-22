import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromBucketType } from "@/store/modules/tx";
import { BucketClient } from "bucket-protocol-sdk";
import { network, suiClient } from "@/configs/networkConfig";
import { extraCoinType } from "@/lib/ptb/index";

export default function assembleWithdrawFromBucket(tx: Transaction, transaction: withdrawFromBucketType) {
    const client = new BucketClient({
        // @ts-expect-error suiClient
        suiClient,
        network
    });
    const lpType = "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";
    const extraCoins: extraCoinType[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = Math.floor(transaction.values[i] / transaction.rate);
        extraCoins.push({
            // @ts-expect-error #private transaction
            coin: client.buildWithdrawFromSavingPoolTransaction(tx, {
                lpType,
                amount
            }),
            coinType: type,
            amount,
            used: false
        });
    }
    return extraCoins;
}