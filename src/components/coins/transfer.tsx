'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { setTransferList } from "@/store/modules/info";

export default function Transfer() {
    const dispatch = useDispatch<AppDispatch>();
    const transferList = useAppSelector(state => state.info.transferList);

    const handleChangeTransferValue = (name: string, value: string) => {
        dispatch(setTransferList(transferList.map(coin => {
            return {
                ...coin,
                transferValue: name === coin.name ? value : coin.transferValue
            }
        })));
    }

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Transfer</span>
            {transferList.map((info, index) => {
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <Input className="w-full h-full text-right"
                                   type="number" placeholder="coin"
                                   value={info.transferValue}
                                   onChange={e => handleChangeTransferValue(info.name, e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between w-full text-xs text-[#0a0e0f] font-sans">
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6"
                                    onClick={() => handleChangeTransferValue(info.name, (Number(info.value) / 4).toString())}>
                                1/4
                            </Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6"
                                    onClick={() => handleChangeTransferValue(info.name, (Number(info.value) / 2).toString())}>
                                1/2
                            </Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6"
                                    onClick={() => handleChangeTransferValue(info.name, info.value.toString())}>
                                MAX
                            </Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6"
                                    onClick={() => dispatch(setTransferList(transferList.filter(list => list.name !== info.name)))}>
                                <X/>
                            </Button>
                        </div>
                    </div>
                );
            })}
            <Button className="w-full cursor-pointer" onClick={() => console.log(transferList.map(coin => Number(coin.transferValue)))}>Add Transaction</Button>
        </div>
    );
}