import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { transferType } from "@/store/modules/tx";

export default function assembleTransfer(tx: Transaction, transaction: transferType) {
    const coins = transaction.coinTypes.map((type, index) => coinWithBalance({
        type,
        balance: Math.floor(transaction.values[index])
    }));
    tx.transferObjects(coins, tx.pure.address(transaction.receipt));
}