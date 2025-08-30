import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { supplyToScallopType } from "@/store/modules/tx";
import { getCoin } from "@/lib/ptb/index";
import { networkConfig } from "@/configs/networkConfig";

export default async function assembleSupplyToScallop(tx: Transaction, sender: string, transaction: supplyToScallopType) {
    const sCoins: TransactionResult[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = transaction.values[i];
        const sCoin = tx.moveCall({
            target: `${networkConfig.mainnet.variables.Scallop.Package}::mint::mint`,
            arguments: [
                tx.object(networkConfig.mainnet.variables.Scallop.Version),
                tx.object(networkConfig.mainnet.variables.Scallop.Market),
                getCoin(tx, type, Math.floor(amount)),
                tx.object("0x6")
            ],
            typeArguments: [
                type
            ]
        });
        sCoins.push(sCoin);
    }
    tx.transferObjects(sCoins, tx.pure.address(sender));
}