'use client'

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

type frameworkType = {
    value: string,
    label: string
}

type itemType = {
    coinType: string,
    value: string
}

export default function TransferCard() {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.realCoins);

    const [list, setList] = useState<itemType[]>([]);
    const [frameworks, setFrameworks] = useState<frameworkType[]>([]);

    useEffect(() => {
        const frameworks: frameworkType[] = [];
        coins.forEach(coin => frameworks.push({
            value: coin.coinType,
            label: coin.name
        }));
        setFrameworks(frameworks);
    }, [coins]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer">Transfer Card</Button>
            </DialogTrigger>
            <DialogContent className="font-mono">
                <DialogHeader>
                    <DialogTitle>Transfer</DialogTitle>
                    <DialogDescription className="font-sans">Transfer your coin(s).</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                    <div className="flex flex-col gap-5 px-10">
                        {list.map((item, index) => {
                            return (
                                <div key={index} className="flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <Select>
                                            <SelectTrigger className="cursor-pointer" size="sm">
                                                <SelectValue placeholder="Select Coin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Coin</SelectLabel>
                                                    {
                                                        frameworks.map((framework, index) =>
                                                            <SelectItem value={framework.value} key={index} className="cursor-pointer">{framework.label}</SelectItem>
                                                        )
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input className="w-56 h-full"
                                               type="number" placeholder="coin value" />
                                    </div>
                                    <div className="flex justify-between self-end w-56 px-1">
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer">
                                            1/4
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer">
                                            1/2
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer">
                                            Max
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer">
                                            <X />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                        <Plus className="self-center border-2 border-[#041f4b] rounded-full cursor-pointer" color="#196ae3"
                              onClick={() => setList([
                                  ...list,
                                  {
                                      coinType: "",
                                      value: ""
                                  }
                              ])} />
                        <div className="flex justify-between w-full gap-1">
                            <Label htmlFor="receipt">Transfer To:</Label>
                            <Input className="w-56 h-full"
                                   type="text" id="receipt" placeholder="address" />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button className="font-sans cursor-pointer">Confirm</Button>
                    <Button variant="outline" className="font-sans cursor-pointer">Clear</Button>
                    <DialogClose asChild>
                        <Button variant="outline" className="font-sans cursor-pointer">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}