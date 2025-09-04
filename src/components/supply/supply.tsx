'use client'

import { useAppSelector } from "@/store";
import { SupplyCard } from "@/components";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Supply() {
    const naviSupply = useAppSelector(state => state.navi);
    const scallopSupply = useAppSelector(state => state.scallop);
    const suiLendSupply = useAppSelector(state => state.suiLend);

    return (
        <ScrollArea className="w-full h-full p-1">
            <SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />
            <SupplyCard title={scallopSupply.title} supplyCoins={scallopSupply.coins} />
            <SupplyCard title={suiLendSupply.title} supplyCoins={suiLendSupply.coins} />
            {/*<SupplyCard title={naviSupply.title} supplyCoins={naviSupply.coins} />*/}
        </ScrollArea>
    );
}