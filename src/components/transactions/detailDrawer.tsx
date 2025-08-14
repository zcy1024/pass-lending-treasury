'use client'

import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { PanelBottomOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailDrawer() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <PanelBottomOpen color="#196ae3" className="cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Transactions Detail</DrawerTitle>
                    <DrawerDescription>Confirm your transactions.</DrawerDescription>
                </DrawerHeader>
                <div className="flex justify-around items-center w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96">
                    <span>Detail Drawer</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                </div>
                <DrawerFooter className="flex flex-col items-center w-full">
                    <Button className="w-24 cursor-pointer">Confirm</Button>
                    <DrawerClose asChild>
                        <Button className="w-24 cursor-pointer" variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}