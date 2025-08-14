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

export default function DetailDrawer() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <PanelBottomOpen color="#196ae3" className="cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="font-mono font-bold text-xl">Transactions Detail</DrawerTitle>
                    <DrawerDescription className="font-sans">Confirm your transactions.</DrawerDescription>
                </DrawerHeader>
                <div className="flex items-center w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96">
                    <ArrowLeft color="#196ae3" className="cursor-pointer" />
                    <div className="flex flex-1 justify-around items-center">
                        <TxDetail />
                        <TxDetail />
                        <TxDetail />
                        <TxDetail />
                    </div>
                    <ArrowRight color="#196ae3" className="cursor-pointer" />
                </div>
                <DrawerFooter className="flex flex-col items-center w-full font-sans">
                    <Button className="w-24 cursor-pointer">Confirm</Button>
                    <div className="flex gap-6 items-center">
                        <DrawerClose asChild>
                            <Button className="w-24 cursor-pointer" variant="outline">Clear</Button>
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