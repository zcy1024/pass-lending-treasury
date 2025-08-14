'use client'

import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { ArrowLeft, ArrowRight, PanelBottomOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TxDetail } from "@/components";
import { useAppSelector, AppDispatch } from "@/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setTransactions } from "@/store/modules/tx";

export default function DetailDrawer() {
    const [page, setPage] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useAppSelector(state => state.tx.transactions);

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <PanelBottomOpen className="cursor-pointer" color="#196ae3" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="font-mono font-bold text-xl">Transactions Detail</DrawerTitle>
                    <DrawerDescription className="font-sans">Confirm your transactions.</DrawerDescription>
                </DrawerHeader>
                <div className="flex items-center w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96">
                    <ArrowLeft className={page === 0 ? "" : "cursor-pointer"}
                               color={page === 0 ? "#afb3b5" : "#196ae3"}
                               onClick={() => {
                                   if (page > 0)
                                       setPage(page - 1);
                               }} />
                    <div className="flex flex-1 justify-around items-center">
                        {transactions.slice(page * 4, page * 4 + 4).map((transaction, index) => {
                            return (
                                <div key={index}><TxDetail transaction={transaction} /></div>
                            );
                        })}
                    </div>
                    <ArrowRight className={page === Math.floor(transactions.length / 4) ? "" : "cursor-pointer"}
                                color={page === Math.floor(transactions.length / 4) ? "#afb3b5" : "#196ae3"}
                                onClick={() => {
                                    if (page < Math.floor(transactions.length / 4))
                                        setPage(page + 1);
                                }} />
                </div>
                <DrawerFooter className="flex flex-col items-center w-full font-sans">
                    <Button className="w-24 cursor-pointer">Confirm</Button>
                    <div className="flex gap-6 items-center">
                        <DrawerClose asChild>
                            <Button className="w-24 cursor-pointer" variant="outline"
                                    onClick={() => dispatch(setTransactions([]))}>
                                Clear
                            </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                            <Button className="w-24 cursor-pointer" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}