import { Transaction } from "@mysten/sui/transactions";
import {
    supplyToBucketType,
    supplyToMultiLendings,
    supplyToNaviType,
    supplyToScallopType,
    supplyToSuiLendType
} from "@/store/modules/tx";
import assembleSupplyToNavi from "@/lib/ptb/assembleSupplyToNavi";
import assembleSupplyToScallop from "@/lib/ptb/assembleSupplyToScallop";
import assembleSupplyToBucket from "@/lib/ptb/assembleSupplyToBucket";
import assembleSupplyToSuiLend from "@/lib/ptb/assembleSupplyToSuiLend";

export default async function assembleSupplyToMultiLendings(tx: Transaction, sender: string, transaction: supplyToMultiLendings) {
    for (const i in transaction.lendings) {
        const lending = transaction.lendings[i];
        const amount = transaction.lending_values[i];
        if (Math.floor(amount) === 0)
            continue;
        if (lending === "Navi") {
            await assembleSupplyToNavi(tx, {
                type: "supplyToNavi",
                coinTypes: transaction.coinTypes,
                names: transaction.names,
                decimals: transaction.decimals,
                values: [amount]
            } as supplyToNaviType);
        } else if (lending === "Scallop") {
            assembleSupplyToScallop(tx, sender, {
                type: "supplyToScallop",
                coinTypes: transaction.coinTypes,
                names: transaction.names,
                decimals: transaction.decimals,
                values: [amount]
            } as supplyToScallopType);
        } else if (lending === "Bucket") {
            assembleSupplyToBucket(tx, sender, {
                type: "supplyToBucket",
                coinTypes: transaction.coinTypes,
                names: transaction.names,
                decimals: transaction.decimals,
                values: [amount]
            } as supplyToBucketType);
        } else if (lending === "SuiLend") {
            await assembleSupplyToSuiLend(tx, sender, {
                type: "supplyToSuiLend",
                coinTypes: transaction.coinTypes,
                names: transaction.names,
                decimals: transaction.decimals,
                values: [amount]
            } as supplyToSuiLendType);
        }
    }
}