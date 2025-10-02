'use server'

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import assembleCreateUser from "@/lib/ptb/leaderboard/assembleCreateUser";
import assembleSetInviter from "@/lib/ptb/leaderboard/assembleSetInviter";
import assembleAddPoints from "@/lib/ptb/leaderboard/assembleAddPoints";

const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });
const keypair = Ed25519Keypair.fromSecretKey(process.env.PRIVATE_KEY!);

export default async function assembleLeaderboardPTB(keys: string[], user: string, code: string, points: number) {
    const tx = new Transaction();
    await assembleCreateUser(tx, user);
    keys.forEach(key => {
        if (key === "invite")
            assembleSetInviter(tx, user, code);
        else
            assembleAddPoints(tx, user, points);
    });
    const res = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair
    });
    await suiClient.waitForTransaction({ digest: res.digest });
}