'use client'

import { Button } from "@/components/ui/button";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { setTransferList } from "@/store/modules/info";

export default function CoinInfo() {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.coins);
    const transferList = useAppSelector(state => state.info.transferList);

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Coins</span>
            {coins.map((info, index) => {
                const canTransfer = transferList.find(list => list.name === info.name) === undefined;
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 group " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <span>{info.value}</span>
                        </div>
                        {
                            canTransfer &&
                            <div className="absolute opacity-0 p-1 group-hover:relative group-hover:opacity-100">
                                <Button variant="outline" className="w-full h-6 rounded-full text-[#0a0e0f] font-sans opacity-0 group-hover:opacity-90 transition-all cursor-pointer"
                                        onClick={() => dispatch(setTransferList(transferList.concat(info)))}>
                                    Transfer
                                </Button>
                            </div>
                        }
                    </div>
                );
            })}
            <Button className="w-full cursor-pointer" disabled={coins.length === transferList.length}
                    onClick={() => dispatch(setTransferList(coins))}>
                Transfer All
            </Button>
        </div>
    );
}