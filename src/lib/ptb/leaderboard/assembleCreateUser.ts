import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";
import devRunLeaderboardTransaction from "@/lib/ptb/leaderboard/devRunLeaderboardTransaction";

function assemblePTB(tx: Transaction, user: string) {
    tx.moveCall({
        target: `${networkConfig[network].variables.Leaderboard.Package}::leaderboard::create_user`,
        arguments: [
            tx.object(networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user)
        ]
    });
}

async function needCreateUser(user: string) {
    const tx = new Transaction();
    assemblePTB(tx, user);
    return await devRunLeaderboardTransaction(tx, user);
}

export default async function assembleCreateUser(tx: Transaction, user: string) {
    if (!(await needCreateUser(user)))
        return;
    assemblePTB(tx, user);
}