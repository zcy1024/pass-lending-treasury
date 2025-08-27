import { Transaction } from "@mysten/sui/transactions";
import { supplyToNaviType } from "@/store/modules/tx";
import { depositCoinPTB } from "@naviprotocol/lending";
import { getCoin } from "@/lib/ptb/index";

export default async function assembleSupplyToNavi(tx: Transaction, transaction: supplyToNaviType) {
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = transaction.values[i];
        // @ts-expect-error #private transaction
        await depositCoinPTB(tx, type, getCoin(tx, type, Math.floor(amount)));
    }
}