'use client'

import { useAppSelector } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailDrawer } from "@/components";

export default function OpenTxCheck() {
    const transactions = useAppSelector(state => state.tx.transactions);

    return (
        <div className={"absolute left-1/2 bottom-0 -translate-x-1/2 " + (transactions.length === 0 ? "hidden" : "")}>
            <div className="flex gap-2 items-center p-1">
                <Avatar>
                    <AvatarImage src="/sui.png" alt="sui logo" />
                    <AvatarFallback>Sui</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="/astros.png" alt="astros logo" />
                    <AvatarFallback>Astros</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="/buck.png" alt="buck logo" />
                    <AvatarFallback>Bucket</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="/navx.png" alt="navx logo" />
                    <AvatarFallback>Navx</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="/scallop.png" alt="scallop logo" />
                    <AvatarFallback>Scallop</AvatarFallback>
                </Avatar>
                <DetailDrawer />
            </div>
        </div>
    );
}