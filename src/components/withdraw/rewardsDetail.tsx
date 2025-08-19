'use client'

import { rewardCoinType } from "@/store/modules/navi";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RewardsDetail({title, rewardCoins}: {
    title: string,
    rewardCoins: rewardCoinType[]
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-36 h-8 cursor-pointer font-sans" variant="outline">Rewards Detail</Button>
            </DialogTrigger>
            <DialogContent className="font-mono">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="font-sans">Rewards detail information.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                    <div className="flex flex-col gap-1 px-10">
                        {rewardCoins.map((coin, index) => {
                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="font-bold">{coin.name}</span>
                                    <span>{coin.reward}</span>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="font-sans cursor-pointer">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}