import { Transaction } from "@mysten/sui/transactions";
import { claimLendingRewardsPTB, getUserAvailableLendingRewards } from "@naviprotocol/lending";

export default async function assembleClaimFromNavi(tx: Transaction, sender: string) {
    const rewards = await getUserAvailableLendingRewards(sender);
    // @ts-expect-error #private transaction
    const rewardCoins = await claimLendingRewardsPTB(tx, rewards);
    tx.transferObjects(rewardCoins.map(coin => coin.coin), sender);
}