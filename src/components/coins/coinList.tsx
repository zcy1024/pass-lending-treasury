'use client'

import { CoinInfo, Transfer } from "@/components";
import { ChevronsLeft } from "lucide-react";
import { useAppSelector } from "@/store";

export default function CoinList() {
    const transferListSize = useAppSelector(state => state.info.transferList.length);

    return (
        <div className="absolute flex flex-row-reverse gap-2 top-0 right-0 py-10 px-1">
            <CoinInfo />
            {transferListSize > 0 && <ChevronsLeft color="#196ae3" />}
            {transferListSize > 0 && <Transfer />}
        </div>
    );
}