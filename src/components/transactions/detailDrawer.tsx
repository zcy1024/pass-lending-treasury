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
import { setTransactions, updateTransactionsInfo } from "@/store/modules/tx";
import assemblePTB from "@/lib/ptb";
import { initProgress, refreshAll, setProgressValue } from "@/store/modules/info";
import { getPasskeyKeypair } from "@/configs/passkey";
import { suiClient } from "@/configs/networkConfig";
import { randomTwentyFive } from "@/lib/utils";
import { toast } from "sonner";

export default function DetailDrawer() {
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.coins);
    const transactions = useAppSelector(state => state.tx.transactions);
    const publicKeyArray = useAppSelector(state => state.info.publicKeyArray);

    const signAndExecuteTransaction = async () => {
        dispatch(setProgressValue(0));
        const tx = assemblePTB(transactions);
        try {
            const keypair = getPasskeyKeypair(window.location.hostname, new Uint8Array(publicKeyArray));
            const res = await suiClient.signAndExecuteTransaction({
                transaction: tx,
                signer: keypair
            });
            dispatch(setProgressValue(randomTwentyFive()));
            await suiClient.waitForTransaction({
                digest: res.digest
            });
            dispatch(refreshAll(new Uint8Array(publicKeyArray)));
            dispatch(setTransactions([]));
            dispatch(initProgress());
            toast("Successful transaction!", {
                description: "Tx digest: " + res.digest.slice(0, 6) + "..." + res.digest.slice(-4),
                action: {
                    label: "view details",
                    onClick: () => window.open(`https://suivision.xyz/txblock/${res.digest}`, "_blank")
                }
            });
            setOpen(false);
        } catch (e) {
            console.error(e);
            dispatch(setProgressValue(100));
            toast("Error transaction!");
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
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
                                <div key={index}><TxDetail transaction={transaction} index={index} setOpenAction={setOpen} /></div>
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
                    <Button className="w-24 cursor-pointer" onClick={signAndExecuteTransaction}>Confirm</Button>
                    <div className="flex gap-6 items-center">
                        <DrawerClose asChild>
                            <Button className="w-24 cursor-pointer" variant="outline"
                                    onClick={() => dispatch(updateTransactionsInfo(coins, []))}>
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