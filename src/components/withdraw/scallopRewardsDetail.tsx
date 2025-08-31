'use client'

import { withdrawCoinType } from "@/store/modules/navi";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsRight } from "lucide-react";
import { useAppSelector } from "@/store";

export default function ScallopRewardsDetail({title, withdrawCoins}: {
    title: string,
    withdrawCoins: withdrawCoinType[]
}) {
    const coins = useAppSelector(state => state.info.realCoins);

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
                        {withdrawCoins.map((coin, index) => {
                            const ownedCoinIndex = coins.findIndex(info => info.coinType === coin.coinType);
                            const decimals = ownedCoinIndex === -1 ? 1 : coins[ownedCoinIndex].decimals;

                            return (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <span>s{coin.name}</span>
                                        <span>{(coin.supplied / decimals).toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <ChevronsRight color="#196ae3" />
                                        <ChevronsRight color="#196ae3" />
                                        <ChevronsRight color="#196ae3" />
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="flex gap-1 items-center">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={coin.src} alt={coin.alt} />
                                                <AvatarFallback>{coin.fallback}</AvatarFallback>
                                            </Avatar>
                                            <h4 className="font-bold">{coin.name}</h4>
                                        </div>
                                        <span>{(coin.withdrawAmount! / decimals).toFixed(2)}</span>
                                    </div>
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