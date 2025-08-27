import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromNaviType } from "@/store/modules/tx";
import { withdrawCoinPTB } from "@naviprotocol/lending";
import { extraCoinType } from "@/lib/ptb/index";

export default async function assembleWithdrawFromNavi(tx: Transaction, transaction: withdrawFromNaviType) {
    const extraCoins: extraCoinType[] = [];
    const usedTypes: string[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        if (usedTypes.findIndex(usedType => usedType === type) !== -1)
            continue;
        usedTypes.push(type);
        let amount = 0;
        for (let j = Number(i); j < transaction.coinTypes.length; j++)
            if (transaction.coinTypes[j] === type)
                amount += Math.floor(transaction.values[j]);
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