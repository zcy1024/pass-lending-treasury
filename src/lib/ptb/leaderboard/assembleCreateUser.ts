import { Transaction } from "@mysten/sui/transactions";
import { network, networkConfig } from "@/configs/networkConfig";
import devRunLeaderboardTransaction from "@/lib/ptb/leaderboard/devRunLeaderboardTransaction";

function assemblePTB(tx: Transaction, user: string, config?: {
    Package: string,
    AdminCap: string,
    InfoList: string
}) {
    tx.moveCall({
        target: `${config ? config.Package : networkConfig[network].variables.Leaderboard.Package}::leaderboard::create_user`,
        arguments: [
            tx.object(config ? config.AdminCap : networkConfig[network].variables.Leaderboard.AdminCap),
            tx.object(config ? config.InfoList : networkConfig[network].variables.Leaderboard.InfoList),
            tx.pure.address(user)
        ]
    });
}

async function needCreateUser(user: string, config?: {
    Package: string,
    AdminCap: string,
    InfoList: string
}) {
    const tx = new Transaction();
    assemblePTB(tx, user, config);
    return await devRunLeaderboardTransaction(tx, user);
}

export default async function assembleCreateUser(tx: Transaction, user: string, config?: {
    Package: string,
    AdminCap: string,
    InfoList: string
}) {
    if (!(await needCreateUser(user, config)))
        return;
    assemblePTB(tx, user, config);
}