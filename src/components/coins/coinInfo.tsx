'use client'

import { Button } from "@/components/ui/button";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { coinType, setTransferList } from "@/store/modules/info";
import { useEffect, useState } from "react";

export default function CoinInfo() {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.coins);
    const newCoins = useAppSelector(state => state.info.newCoins);
    const transferList = useAppSelector(state => state.info.transferList);

    const [infos, setInfos] = useState<coinType[]>([]);
    useEffect(() => {
        let temp: coinType[] = [];
        temp = temp.concat(coins.map(coin => {
            const index = newCoins.findIndex(newCoin => coin.name === newCoin.name);
            return index === -1 ? coin : newCoins[index];
        }))
        temp = temp.concat(newCoins.filter(newCoin => coins.findIndex(coin => coin.name === newCoin.name) === -1));
        setInfos(temp.filter(coin => coin.value > 0));
    }, [coins, newCoins]);

    const checkUpdated = (newCoin: coinType) => {
        const index = coins.findIndex(coin => coin.name === newCoin.name);
        return index === -1 || coins[index].value !== newCoin.value;
    }

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Coins</span>
            {infos.length === 0 && <span className="font-sans text-xs text-[#afb3b5]">no coins</span>}
            {infos.map((info, index) => {
                const canTransfer = transferList.find(list => list.name === info.name) === undefined;
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 group " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <span className={checkUpdated(info) ? "text-[#35a1f7]" : ""}>{info.value}</span>
                        </div>
                        {
                            canTransfer &&
                            <div className="absolute opacity-0 p-1 group-hover:relative group-hover:opacity-100">
                                <Button variant="outline" className="w-full h-6 rounded-full text-[#0a0e0f] font-sans opacity-0 group-hover:opacity-90 transition-all cursor-pointer"
                                        onClick={() => dispatch(setTransferList(transferList.concat({
                                            ...info,
                                            transferValue: ""
                                        })))}>
                                    Transfer
                                </Button>
                            </div>
                        }
                    </div>
                );
            })}
            <Button className="w-full cursor-pointer" disabled={infos.length === transferList.length}
                    onClick={() => dispatch(setTransferList(infos.map(coin => {
                        return {
                            ...coin,
                            transferValue: coin.value.toString()
                        }
                    })))}>
                Transfer All
            </Button>
        </div>
    );
}