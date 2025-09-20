import { Transaction } from "@mysten/sui/transactions";
import { supplyToBucketType } from "@/store/modules/tx";
import { BucketClient } from "bucket-protocol-sdk";
import { network, suiClient } from "@/configs/networkConfig";
import { getCoin } from "@/lib/ptb/index";

export default function assembleSupplyToBucket(tx: Transaction, sender: string, transaction: supplyToBucketType) {
    const client = new BucketClient({
        // @ts-expect-error suiClient
        suiClient,
        network
    });
    const lpType = "0x38f61c75fa8407140294c84167dd57684580b55c3066883b48dedc344b1cde1e::susdb::SUSDB";
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = transaction.values[i];
        // @ts-expect-error Transaction
        client.buildDepositToSavingPoolTransaction(tx, {
            lpType,
            address: sender,
            depositCoinOrAmount: getCoin(tx, type, Math.floor(amount))
        });
    }
}