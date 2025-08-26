'use client'

import { useAppSelector } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WithdrawCard } from "@/components";

export default function Withdraw() {
    const naviWithdraw = useAppSelector(state => state.navi);

    return (
        <ScrollArea className="w-full h-full p-1">
            <WithdrawCard title={naviWithdraw.title} withdrawCoins={naviWithdraw.withdrawCoins} rewardCoins={naviWithdraw.rewardCoins} />
            {/*<WithdrawCard title={naviWithdraw.title} withdrawCoins={naviWithdraw.withdrawCoins} rewardCoins={naviWithdraw.rewardCoins} />*/}
            {/*<WithdrawCard title={naviWithdraw.title} withdrawCoins={naviWithdraw.withdrawCoins} rewardCoins={naviWithdraw.rewardCoins} />*/}
            {/*<WithdrawCard title={naviWithdraw.title} withdrawCoins={naviWithdraw.withdrawCoins} rewardCoins={naviWithdraw.rewardCoins} />*/}
            {/*<WithdrawCard title={naviWithdraw.title} withdrawCoins={naviWithdraw.withdrawCoins} rewardCoins={naviWithdraw.rewardCoins} />*/}
        </ScrollArea>
    );
}