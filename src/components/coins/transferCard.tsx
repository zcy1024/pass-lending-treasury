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
import { transferType, updateTransactionsInfo } from "@/store/modules/tx";

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
    const regionCoins = useAppSelector(state => state.info.coins);
    const transactions = useAppSelector(state => state.tx.transactions);

    const [list, setList] = useState<itemType[]>([]);
    const [frameworks, setFrameworks] = useState<frameworkType[]>([]);
    const [receipt, setReceipt] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(true);

    useEffect(() => {
        const frameworks: frameworkType[] = [];
        coins.forEach(coin => {
            if (coin.value > 0)
                frameworks.push({
                    value: coin.coinType,
                    label: coin.name
                });
        });
        setFrameworks(frameworks);
    }, [coins]);

    const addTransactions = () => {
        const validList = list.filter(item => item.coinType && item.value && Number(item.value) > 0);
        const matchedCoinIndex = validList.map(item => coins.findIndex(coin => coin.coinType === item.coinType));
        if (validList.length === 0 || matchedCoinIndex.find(index => index === -1)) {
            setIsValid(false);
            return;
        }
        const isValid = dispatch(updateTransactionsInfo(regionCoins, transactions.concat([{
            type: "transfer",
            coinTypes: validList.map(item => item.coinType),
            names: matchedCoinIndex.map(idx => coins[idx].name),
            decimals: matchedCoinIndex.map(idx => coins[idx].decimals),
            values: validList.map((item, idx) => Number(item.value) * coins[matchedCoinIndex[idx]].decimals),
            receipt
        } as transferType])));
        if (!isValid) {
            setIsValid(false);
            return;
        }
        setList([]);
        setIsValid(true);
    }

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
                            const coin = coins.find(coin => coin.coinType === item.coinType);
                            const amount = coin ? coin.value : 0;
                            const decimals = coin ? coin.decimals : 1;

                            return (
                                <div key={index} className="flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <Select value={item.coinType} onValueChange={type => setList(list.map((item, idx) => idx !== index ? item : {
                                            coinType: type,
                                            value: item.value
                                        }))}>
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
                                               type="number" placeholder="coin value"
                                               value={item.value}
                                               onChange={e => setList(list.map((item, idx) => idx !== index ? item : {
                                                   coinType: item.coinType,
                                                   value: e.target.value
                                               }))} />
                                    </div>
                                    <div className="flex justify-between self-end w-56 px-1">
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                                onClick={() => setList(list.map((item, idx) => idx !== index ? item : {
                                                    coinType: item.coinType,
                                                    value: (amount / 4 / decimals).toString()
                                                }))}>
                                            1/4
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                                onClick={() => setList(list.map((item, idx) => idx !== index ? item : {
                                                    coinType: item.coinType,
                                                    value: (amount / 2 / decimals).toString()
                                                }))}>
                                            1/2
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                                onClick={() => setList(list.map((item, idx) => idx !== index ? item : {
                                                    coinType: item.coinType,
                                                    value: (amount / decimals).toString()
                                                }))}>
                                            Max
                                        </Button>
                                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                                onClick={() => setList(list.filter((_, idx) => idx !== index))}>
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
                                   type="text" id="receipt" placeholder="address"
                                   value={receipt}
                                   onChange={e => setReceipt(e.target.value)} />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="flex gap-3 items-center">
                    <span className="text-xs font-sans text-red-600">{isValid ? "" : "error information"}</span>
                    <Button className="font-sans cursor-pointer"
                            disabled={!receipt || list.find(item => item.coinType === "" || item.value === "") !== undefined}
                            onClick={addTransactions}>
                        Confirm
                    </Button>
                    <Button variant="outline" className="font-sans cursor-pointer"
                            onClick={() => setList([])}>
                        Clear
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline" className="font-sans cursor-pointer">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}