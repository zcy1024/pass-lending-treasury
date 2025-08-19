'use client'

import { Button } from "@/components/ui/button";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { coinType, setTransferList } from "@/store/modules/info";

export default function CoinInfo() {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.coins);
    const realCoins = useAppSelector(state => state.info.realCoins);
    const transferList = useAppSelector(state => state.info.transferList);

    const checkUpdated = (newCoin: coinType) => {
        const index = coins.findIndex(coin => coin.coinType === newCoin.coinType);
        return index === -1 || coins[index].value !== newCoin.value;
    }

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Coins</span>
            {realCoins.length === 0 && <span className="font-sans text-xs text-[#afb3b5]">no coins</span>}
            {realCoins.map((info, index) => {
                const canTransfer = transferList.find(list => list.coinType === info.coinType) === undefined;
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 group " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <span className={checkUpdated(info) ? "text-[#35a1f7]" : ""}>{(info.value / info.decimals).toFixed(2)}</span>
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
            <Button className="w-full cursor-pointer" disabled={realCoins.length === transferList.length}
                    onClick={() => dispatch(setTransferList(realCoins.map(coin => {
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