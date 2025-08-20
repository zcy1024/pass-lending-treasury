'use client'

import { useAppSelector } from "@/store";
import { coinType } from "@/store/modules/info";
import { Swap, TransferCard } from "@/components";

export default function CoinInfo() {
    const coins = useAppSelector(state => state.info.coins);
    const realCoins = useAppSelector(state => state.info.realCoins);

    const checkUpdated = (newCoin: coinType) => {
        const index = coins.findIndex(coin => coin.coinType === newCoin.coinType);
        return index === -1 || coins[index].value !== newCoin.value;
    }

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Coins</span>
            {realCoins.length === 0 && <span className="font-sans text-xs text-[#afb3b5]">no coins</span>}
            {realCoins.map((info, index) => {
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 group " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <span className={checkUpdated(info) ? "text-[#35a1f7]" : ""}>{(info.value / info.decimals).toFixed(2)}</span>
                        </div>
                    </div>
                );
            })}
            <TransferCard />
            <Swap />
        </div>
    );
}