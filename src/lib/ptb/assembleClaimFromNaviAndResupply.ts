import { Transaction } from "@mysten/sui/transactions";
import { claimLendingRewardsPTB, getUserAvailableLendingRewards } from "@naviprotocol/lending";

export default async function assembleClaimFromNaviAndResupply(tx: Transaction, sender: string) {
    const rewards = await getUserAvailableLendingRewards(sender);
    // @ts-expect-error #private transaction
    await claimLendingRewardsPTB(tx, rewards, {
        accountCap: sender,
        customCoinReceive: {
            type: "depositNAVI"
        }
    });
}