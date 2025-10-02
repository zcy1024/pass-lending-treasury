import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";

export default function assembleAddPoints(tx: Transaction, user: string, points: number) {
    tx.moveCall({
        target: `${networkConfig[network].variables.Leaderboard.Package}::leaderboard::add_points`,
        arguments: [
            tx.object(networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user),
            tx.pure.u64(points)
        ]
    });
}