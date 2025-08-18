'use client'

import { rewardCoinType, withdrawCoinType } from "@/store/modules/navi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RewardsDetail } from "@/components";
import { useState } from "react";

export default function WithdrawCard({title, withdrawCoins, rewardCoins}: {
    title: string,
    withdrawCoins: withdrawCoinType[],
    rewardCoins: rewardCoinType[],
}) {
    const [withdrawInfos, setWithdrawInfos] = useState<{
        name: string,
        amount: string
    }[]>([]);

    const getWithdrawAmount = (name: string) => {
        const index = withdrawInfos.findIndex(info => info.name === name);
        return index === -1 ? "" : withdrawInfos[index].amount;
    }

    const updateWithdrawInfo = (name: string, amount: string) => {
        setWithdrawInfos([
            ...withdrawInfos.filter(info => info.name !== name),
            {
                name,
                amount
            }
        ]);
    }

    const isInvalidWithdrawAmount = (name: string) => {
        const input = getWithdrawAmount(name);
        const index = withdrawCoins.findIndex(coin => coin.name === name);
        return !input || index === -1 || Number(input) === 0 || Number(input) > withdrawCoins[index].supplied;
    }

    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {withdrawCoins.map((coin, index) => {
                return (
                    <div key={index} className="flex justify-between items-center px-10 m-1">
                        <h4 className="font-bold">{coin.name}</h4>
                        <div className="flex gap-10 items-center">
                            <span className="text-xs text-[#afb3b5]">Supplied: {coin.supplied}</span>
                            <div className="flex gap-2 items-center">
                                <Input className="h-full" type="number" placeholder="Withdraw Coin Value"
                                       value={getWithdrawAmount(coin.name)}
                                       onChange={e => updateWithdrawInfo(coin.name, e.target.value)} />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.name, (coin.supplied / 4).toFixed(2))}>
                                    1/4
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.name, (coin.supplied / 2).toFixed(2))}>
                                    1/2
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.name, coin.supplied.toFixed(2))}>
                                    Max
                                </Button>
                                <Button className="w-24 h-6 cursor-pointer font-sans"
                                        disabled={isInvalidWithdrawAmount(coin.name)}>
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