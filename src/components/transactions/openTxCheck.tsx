'use client'

import { useAppSelector } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailDrawer } from "@/components";
import { typeToInfo } from "@/store/modules/tx";

export default function OpenTxCheck() {
    const transactions = useAppSelector(state => state.tx.transactions);

    return (
        <div className={"absolute left-1/2 bottom-0 -translate-x-1/2 " + (transactions.length === 0 ? "hidden" : "")}>
            <div className="flex gap-2 items-center p-1">
                {transactions.map((transaction, index) => {
                    return (
                        <Avatar key={index}>
                            <AvatarImage src={typeToInfo.get(transaction.type)!.src} alt={typeToInfo.get(transaction.type)!.alt} />
                            <AvatarFallback>{typeToInfo.get(transaction.type)!.fallback}</AvatarFallback>
                        </Avatar>
                    );
                })}
                <DetailDrawer />
            </div>
        </div>
    );
}