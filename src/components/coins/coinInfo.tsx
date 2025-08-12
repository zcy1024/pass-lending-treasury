'use client'

import { Button } from "@/components/ui/button";

const coins = [
    {
        name: "Sui",
        balance: "1000000000"
    },
    {
        name: "NAVX",
        balance: "100"
    },
    {
        name: "SCALLOP",
        balance: "999"
    },
    {
        name: "BUCK",
        balance: "987654"
    },
]

export default function CoinInfo() {
    return (
        <div className="flex flex-col gap-3 items-center h-full w-1/12 min-w-[150px] font-mono">
            <span className="font-bold text-xl">Coins</span>
            {coins.map((info, index) => {
                return (
                    <div key={index}
                         className={"flex flex-col gap-1 w-full rounded-xl p-1 group " + (index % 2 === 0 ? "bg-[#F9F9F9]" : "bg-[#FFF]")}>
                        <div className="flex justify-between items-center">
                            <span>{info.name}:</span>
                            <span>{info.balance}</span>
                        </div>
                        <div className="absolute opacity-0 p-1 group-hover:relative group-hover:opacity-100">
                            <Button variant="outline" className="w-full h-6 rounded-full text-[#0a0e0f] font-sans opacity-0 group-hover:opacity-90 transition-all cursor-pointer"
                                 onClick={() => console.log(info.name, info.balance)}>
                                Transfer
                            </Button>
                        </div>
                    </div>
                );
            })}
            <Button className="w-full cursor-pointer">Transfer All</Button>
        </div>
    );
}