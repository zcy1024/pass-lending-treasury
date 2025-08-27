'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
    isTransferType,
    supplyToNaviType,
    transferType,
    typeToInfo,
    updateNewCoins,
    updateTransactionsInfo, withdrawFromNaviType
} from "@/store/modules/tx";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { Dispatch, SetStateAction } from "react";

export default function TxDetail({transaction, index, setOpenAction}: {
    transaction: transferType | supplyToNaviType | withdrawFromNaviType,
    index: number,
    setOpenAction: Dispatch<SetStateAction<boolean>>
}) {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.coins);
    const transactions = useAppSelector(state => state.tx.transactions);

    return (
        <ScrollArea className="relative w-48 h-60 border border-[#0a0e0f] rounded-xl px-5 py-1">
            <div className="flex flex-col items-center font-mono">
                <div className="flex items-center">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={typeToInfo.get(transaction.type)!.src} alt={typeToInfo.get(transaction.type)!.alt} />
                        <AvatarFallback>{typeToInfo.get(transaction.type)!.fallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-lg">
                        {transaction.type === "transfer" ? transaction.type : (transaction.type.match("claim") ? (transaction.type.match("Resupply") ? "resupply" : "claim") : (transaction.type.match("withdraw") ? "withdraw" : "supply"))}
                    </span>
                </div>
                {
                    isTransferType(transaction) &&
                    <span className="font-sans text-xs text-[#afb3b5] -mt-1">To: {transaction.receipt.slice(0, 6) + "..." + transaction.receipt.slice(-4)}</span>
                }
                <div className="w-full h-1"></div>
                {transaction.names.map((name, index) => {
                    return (
                        <div className="flex justify-between items-center w-full" key={index}>
                            <span>{name}</span>
                            <span>{(transaction.values[index] / transaction.decimals[index]).toFixed(2)}</span>
                        </div>
                    );
                })}
            </div>
            <Button className="absolute top-1 right-1 h-6 w-6 cursor-pointer"
                    variant="ghost" disabled={!updateNewCoins(coins.concat(), transactions.filter((_, idx) => idx !== index))[0]}
                    onClick={() => {
                        setOpenAction(transactions.length > 1);
                        dispatch(updateTransactionsInfo(coins, transactions.filter((_, idx) => idx !== index)));
                    }}>
                <X />
            </Button>
        </ScrollArea>
    );
}