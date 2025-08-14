'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { transferType, typeToInfo } from "@/store/modules/tx";

export default function TxDetail({transaction}: {transaction: transferType}) {
    return (
        <ScrollArea className="w-48 h-60 border border-[#0a0e0f] rounded-xl px-5 py-1">
            <div className="flex flex-col items-center font-mono">
                <div className="flex items-center">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={typeToInfo.get(transaction.type)!.src} alt={typeToInfo.get(transaction.type)!.alt} />
                        <AvatarFallback>{typeToInfo.get(transaction.type)!.fallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-lg">{transaction.type}</span>
                </div>
                {
                    transaction.type === "transfer" &&
                    <span className="font-sans text-xs text-[#afb3b5] -mt-1">To: {transaction.receipt}</span>
                }
                <div className="w-full h-1"></div>
                {transaction.names.map((name, index) => {
                    return (
                        <div className="flex justify-between items-center w-full" key={index}>
                            <span>{name}:</span>
                            <span>{transaction.values[index]}</span>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}