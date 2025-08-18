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
        name: string,
        amount: string
    }[]>([]);

    const getSupplyAmount = (name: string) => {
        const index = supplyInfos.findIndex(info => info.name === name);
        return index === -1 ? "" : supplyInfos[index].amount;
    }

    const updateSupplyInfo = (name: string, amount: string) => {
        setSupplyInfos([
            ...supplyInfos.filter(info => info.name !== name),
            {
                name,
                amount
            }
        ]);
    }

    const isInvalidSupplyAmount = (name: string) => {
        const input = getSupplyAmount(name);
        const index = coins.findIndex(coin => coin.name === name);
        return !input || index === -1 || Number(input) === 0 || Number(input) > coins[index].value;
    }

    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {supplyCoins.map((coin, index) => {
                const ownedCoinIndex = coins.findIndex(info => info.name === coin.name);
                const ownedCoinValue = ownedCoinIndex === -1 ? 0 : coins[ownedCoinIndex].value;

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
                                       value={getSupplyAmount(coin.name)}
                                       onChange={e => updateSupplyInfo(coin.name, e.target.value)} />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.name, (ownedCoinValue / 4).toFixed(2))}>
                                    1/4
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.name, (ownedCoinValue / 2).toFixed(2))}>
                                    1/2
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateSupplyInfo(coin.name, ownedCoinValue.toFixed(2))}>
                                    Max
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans"
                                        disabled={isInvalidSupplyAmount(coin.name)}>
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