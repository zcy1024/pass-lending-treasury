import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromNaviType } from "@/store/modules/tx";
import { withdrawCoinPTB } from "@naviprotocol/lending";
import { extraCoinType } from "@/lib/ptb/index";

export default async function assembleWithdrawFromNavi(tx: Transaction, transaction: withdrawFromNaviType) {
    const extraCoins: extraCoinType[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = Math.floor(transaction.values[i]);
        extraCoins.push({
            // @ts-expect-error #private transaction
            coin: await withdrawCoinPTB(tx, type, amount),
            coinType: type,
            amount,
            used: false
        });
    }
    return extraCoins;
}