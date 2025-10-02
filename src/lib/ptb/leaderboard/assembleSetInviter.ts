import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";

export default function assembleSetInviter(tx: Transaction, user: string, code: string) {
    tx.moveCall({
        target: `${networkConfig[network].variables.Leaderboard.Package}::leaderboard::set_inviter`,
        arguments: [
            tx.object(networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user),
            tx.pure.string(code)
        ]
    });
}