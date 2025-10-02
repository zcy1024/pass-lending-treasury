import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";

export default function assembleAddPoints(tx: Transaction, user: string, points: number, config?: {
    Package: string,
    AdminCap: string,
    InfoList: string
}) {
    tx.moveCall({
        target: `${config ? config.Package : networkConfig[network].variables.Leaderboard.Package}::leaderboard::add_points`,
        arguments: [
            tx.object(config ? config.AdminCap : networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(config ? config.InfoList : networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user),
            tx.pure.u64(points)
        ]
    });
}