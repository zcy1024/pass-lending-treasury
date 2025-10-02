import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

export default async function devRunLeaderboardTransaction(tx: Transaction, sender: string) {
    const res = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender
    });
    return res.effects.status.status === "success";
}