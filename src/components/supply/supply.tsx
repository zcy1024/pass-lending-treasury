'use client'

import { useAppSelector } from "@/store";
import { SupplyCard } from "@/components";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Supply() {
    const naviSupply = useAppSelector(state => state.navi);

    return (
        <ScrollArea className="w-full h-full p-1 border border-black">
            <SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />
            <SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />
            <SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />
            <SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />
        </ScrollArea>
    );
}