import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

export default async function checkValidCode(code: string, sender: string) {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const tx = new Transaction();
    tx.moveCall({
        target: `${networkConfig[network].variables.Leaderboard.Package}::leaderboard::check_code`,
        arguments: [
            tx.object(networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.string(code)
        ]
    });
    const res = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender
    });
    return res.effects.status.status === "success";
}