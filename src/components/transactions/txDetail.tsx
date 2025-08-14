'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TxDetail() {
    return (
        <ScrollArea className="w-48 h-60 border border-[#0a0e0f] rounded-xl px-5 py-1">
            <div className="flex flex-col items-center font-mono">
                <div className="flex items-center">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src="/sui.png" alt="sui logo" />
                        <AvatarFallback>Sui</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-lg">Transfer</span>
                </div>
                <span className="font-sans text-xs text-[#afb3b5] -mt-1">To: 0x665e...ad80</span>
                <div className="w-full h-1"></div>
                <div className="flex justify-between items-center w-full">
                    <span>Sui:</span>
                    <span>1000000000</span>
                </div>
            </div>
        </ScrollArea>
    );
}