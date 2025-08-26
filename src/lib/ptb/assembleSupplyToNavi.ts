import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { supplyToNaviType } from "@/store/modules/tx";
import { depositCoinPTB } from "@naviprotocol/lending";

export default async function assembleSupplyToNavi(tx: Transaction, transaction: supplyToNaviType) {
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = transaction.values[i];
        // @ts-expect-error #private transaction
        await depositCoinPTB(tx, type, coinWithBalance({
            type,
            balance: Math.floor(amount),
            useGasCoin: type === "0x2::sui::SUI"
        }));
    }
}