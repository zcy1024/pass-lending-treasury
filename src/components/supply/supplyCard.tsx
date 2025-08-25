'use client'

import { supplyCoinType } from "@/store/modules/navi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import { useState } from "react";

export default function SupplyCard({title, supplyCoins}: {
    title: string,
    supplyCoins: supplyCoinType[]
}) {
    const coins = useAppSelector(state => state.info.realCoins);
    const [supplyInfos, setSupplyInfos] = useState<{
        coinType: string,
        amount: string
    }[]>([]);

    const getSupplyAmount = (type: string) => {
        const index = supplyInfos.findIndex(info => info.coinType === type);
        return index === -1 ? "" : supplyInfos[index].amount;
    }

    const updateSupplyInfo = (type: string, amount: string) => {
        setSupplyInfos([
            ...supplyInfos.filter(info => info.coinType !== type),
            {
                coinType: type,
                amount
            }
        ]);
    }

    const isInvalidSupplyAmount = (type: string) => {
        const input = getSupplyAmount(type);
        const index = coins.findIndex(coin => coin.coinType === type);
        return !input || index === -1 || Number(input) === 0 || Number(input) > coins[index].value;
    }

    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {supplyCoins.map((coin, index) => {
                const ownedCoinIndex = coins.findIndex(info => info.coinType === coin.coinType);
                const ownedCoinValue = ownedCoinIndex === -1 ? 0 : coins[ownedCoinIndex].value;
                const decimals = ownedCoinIndex === -1 ? 1 : coins[ownedCoinIndex].decimals;

                return (
                    <div key={index} className="flex justify-between items-center px-10 m-1">
                        <div className="flex gap-1 items-center">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={coin.src} alt={coin.alt} />
                                <AvatarFallback>{coin.fallback}</AvatarFallback>
                            </Avatar>
                            <h4 className="font-bold">{coin.name}</h4>
                        </div>
                        <div className="flex gap-10 items-center">
                            <span>{coin.apr}%</span>
                            <div className="flex gap-2 items-center">
                                <Input className="h-full" type="number" placeholder="Supply Coin Value"
                                       value={getSupplyAmount(coin.coinType)}
                                       onChange={e => updateSupplyInfo(coin.coinType, e.target.value)} />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.coinType, (ownedCoinValue / 4 / decimals).toString())}>
                                    1/4
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.coinType, (ownedCoinValue / 2 / decimals).toString())}>
                                    1/2
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.coinType, (ownedCoinValue / decimals).toString())}>
                                    Max
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans"
                                        disabled={isInvalidSupplyAmount(coin.coinType)}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
            <hr className="my-5" />
        </div>
    );
}