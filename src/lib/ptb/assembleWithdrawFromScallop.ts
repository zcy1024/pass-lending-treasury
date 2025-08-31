import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromScallopType } from "@/store/modules/tx";
import { networkConfig } from "@/configs/networkConfig";
import { extraCoinType, getCoin } from "@/lib/ptb/index";

function call(tx: Transaction, coinType: string, marketType: string, amount: number) {
    return tx.moveCall({
        target: `${networkConfig.mainnet.variables.Scallop.Package}::redeem::redeem`,
        arguments: [
            tx.object(networkConfig.mainnet.variables.Scallop.Version),
            tx.object(networkConfig.mainnet.variables.Scallop.Market),
            getCoin(tx, marketType, amount),
            tx.object("0x6")
        ],
        typeArguments: [
            coinType
        ]
    });
}

export default function assembleWithdrawFromScallop(tx: Transaction, transaction: withdrawFromScallopType) {
    const extraCoins: extraCoinType[] = [];
    const usedTypes: string[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const marketType = transaction.marketTypes[i];
        if (usedTypes.findIndex(usedType => usedType === type) !== -1)
            continue;
        usedTypes.push(type);
        let amount = 0;
        let withdrawAmount = 0;
        for (let j = Number(i); j < transaction.coinTypes.length; j++)
            if (transaction.coinTypes[j] === type) {
                amount += Math.floor(transaction.values[j]);
                withdrawAmount += Math.floor(transaction.withdrawValues[j]);
            }
        extraCoins.push({
            coin: call(tx, type, marketType, amount),
            coinType: type,
            amount: withdrawAmount,
            used: false
        });
    }
    return extraCoins;
}