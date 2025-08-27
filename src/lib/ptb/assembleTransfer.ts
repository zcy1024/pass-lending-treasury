import { Transaction } from "@mysten/sui/transactions";
import { transferType } from "@/store/modules/tx";
import { getCoin } from "@/lib/ptb/index";

export default function assembleTransfer(tx: Transaction, transaction: transferType) {
    const coins = transaction.coinTypes.map((type, index) => getCoin(tx, type, Math.floor(transaction.values[index])));
    tx.transferObjects(coins, tx.pure.address(transaction.receipt));
}