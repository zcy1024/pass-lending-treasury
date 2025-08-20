'use client'

import { CoinInfo } from "@/components";

export default function CoinList() {
    return (
        <div className="absolute flex flex-row-reverse gap-2 top-0 right-0 py-10 px-1">
            <CoinInfo />
        </div>
    );
}