import { isSupplyToNaviType, isTransferType, transactionType } from "@/store/modules/tx";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import assembleTransfer from "@/lib/ptb/assembleTransfer";
import { suiClient } from "@/configs/networkConfig";
import assembleSupplyToNavi from "@/lib/ptb/assembleSupplyToNavi";

async function dryRun(tx: Transaction, sender: string): Promise<[boolean, number]> {
    const res = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender
    });
    if (res.effects.status.error)
        console.log("dry run error: ", res.effects.status.error);
    return [res.effects.status.status === "success", Number(res.effects.gasUsed.computationCost) + Number(res.effects.gasUsed.storageCost)];
}

export default async function assemblePTB(transactions: transactionType, sender: string): Promise<[Transaction, boolean]> {
    const tx = new Transaction();
    for (const transaction of transactions) {
        if (isTransferType(transaction))
            assembleTransfer(tx, transaction);
        else if (isSupplyToNaviType(transaction))
            await assembleSupplyToNavi(tx, transaction);
    }
    const [success, gas] = await dryRun(tx, sender);
    // An additional fee of one thousandth
    tx.transferObjects([coinWithBalance({
        type: "0x2::sui::SUI",
        balance: Math.floor(gas / 1000),
        useGasCoin: true
    })], tx.pure.address("0x4ee352f9b259edc642cd4dd028c0ce3491d97dd01a7bb570eb16d74711e08c09"));
    return [tx, success];
}