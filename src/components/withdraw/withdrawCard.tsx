'use client'

import { rewardCoinType, withdrawCoinType } from "@/store/modules/navi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RewardsDetail } from "@/components";
import { useState } from "react";
import { useAppSelector } from "@/store";

export default function WithdrawCard({title, withdrawCoins, rewardCoins}: {
    title: string,
    withdrawCoins: withdrawCoinType[],
    rewardCoins: rewardCoinType[],
}) {
    const coins = useAppSelector(state => state.info.realCoins);
    const [withdrawInfos, setWithdrawInfos] = useState<{
        coinType: string,
        amount: string
    }[]>([]);

    const getWithdrawAmount = (type: string) => {
        const index = withdrawInfos.findIndex(info => info.coinType === type);
        return index === -1 ? "" : withdrawInfos[index].amount;
    }

    const updateWithdrawInfo = (type: string, amount: string) => {
        setWithdrawInfos([
            ...withdrawInfos.filter(info => info.coinType !== type),
            {
                coinType: type,
                amount
            }
        ]);
    }

    const isInvalidWithdrawAmount = (type: string) => {
        const input = getWithdrawAmount(type);
        const index = withdrawCoins.findIndex(coin => coin.coinType === type);
        return !input || index === -1 || Number(input) === 0 || Number(input) > withdrawCoins[index].supplied;
    }

    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {withdrawCoins.map((coin, index) => {
                const ownedCoinIndex = coins.findIndex(info => info.coinType === coin.coinType);
                const decimals = ownedCoinIndex === -1 ? 1 : coins[ownedCoinIndex].decimals;

                return (
                    <div key={index} className="flex justify-between items-center px-10 m-1">
                        <h4 className="font-bold">{coin.name}</h4>
                        <div className="flex gap-10 items-center">
                            <span className="text-xs text-[#afb3b5]">Supplied: {coin.supplied}</span>
                            <div className="flex gap-2 items-center">
                                <Input className="h-full" type="number" placeholder="Withdraw Coin Value"
                                       value={getWithdrawAmount(coin.coinType)}
                                       onChange={e => updateWithdrawInfo(coin.coinType, e.target.value)} />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (coin.supplied / 4 / decimals).toString())}>
                                    1/4
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (coin.supplied / 2 / decimals).toString())}>
                                    1/2
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (coin.supplied / decimals).toString())}>
                                    Max
                                </Button>
                                <Button className="w-24 h-6 cursor-pointer font-sans"
                                        disabled={isInvalidWithdrawAmount(coin.coinType)}>
                                    Withdraw
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex gap-2 justify-end items-center mt-6">
                <RewardsDetail title={title} rewardCoins={rewardCoins} />
                <Button className="w-36 h-8 cursor-pointer font-sans">Claim Reward</Button>
                <Button className="w-36 h-8 cursor-pointer font-sans">Claim And ReSupply</Button>
            </div>
            <hr className="my-5" />
        </div>
    );
}