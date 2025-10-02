import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";

export default function assembleSetInviter(tx: Transaction, user: string, code: string, config?: {
    Package: string,
    AdminCap: string,
    InfoList: string
}) {
    tx.moveCall({
        target: `${config ? config.Package : networkConfig[network].variables.Leaderboard.Package}::leaderboard::set_inviter`,
        arguments: [
            tx.object(config ? config.AdminCap : networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(config ? config.InfoList : networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user),
            tx.pure.string(code)
        ]
    });
}