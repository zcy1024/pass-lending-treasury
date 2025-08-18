'use client'

import { supplyCoinType } from "@/store/modules/navi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SupplyCard({title, supplyCoins}: {
    title: string,
    supplyCoins: supplyCoinType[]
}) {
    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {supplyCoins.map((coin, index) => {
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
                                <Input className="h-full" type="number" placeholder="Supply Coin Value" />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline">1/4</Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline">1/2</Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline">Max</Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans">Add</Button>
                            </div>
                        </div>
                    </div>
                );
            })}
            <hr className="my-5" />
        </div>
    );
}