import { transactionType } from "@/store/modules/tx";
import { Transaction } from "@mysten/sui/transactions";
import assembleTransfer from "@/lib/ptb/assembleTransfer";

export default function assemblePTB(transactions: transactionType) {
    const tx = new Transaction();
    transactions.forEach(transaction => {
        if (transaction.type === "transfer")
            assembleTransfer(tx, transaction);
    });
    return tx;
}