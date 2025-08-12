'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppSelector } from "@/store";

export default function Transfer() {
    const transferList = useAppSelector(state => state.info.transferList);

    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Transfer</span>
            {transferList.map((info, index) => {
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <Input type="number" placeholder="coin" className="w-full h-full" />
                        </div>
                        <div className="flex justify-between w-full text-xs text-[#0a0e0f] font-sans">
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6" onClick={() => console.log(info.name, Number(info.value) / 4)}>1/4</Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6" onClick={() => console.log(info.name, Number(info.value) / 2)}>1/2</Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6" onClick={() => console.log(info.name, info.value)}>MAX</Button>
                            <Button variant="outline" className="cursor-pointer w-1/5 h-6" onClick={() => console.log(`close: ${info.name}`)}><X/></Button>
                        </div>
                    </div>
                );
            })}
            <Button className="w-full cursor-pointer">Add Transaction</Button>
        </div>
    );
}