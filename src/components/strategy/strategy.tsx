'use client'

import { useAppSelector } from "@/store";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supplyCoinType } from "@/store/modules/navi";

type frameworkType = {
    value: string,
    label: string
};

type infoType = {
    lending: string,
    sliderValue: number,
    amount: string
};

export default function Strategy() {
    const coins = useAppSelector(state => state.info.realCoins);
    const naviSupplyCoins = useAppSelector(state => state.navi.coins);
    const scallopSupplyCoins = useAppSelector(state => state.scallop.coins);
    const bucketSupplyCoins = useAppSelector(state => state.bucket.coins);
    const suiLendSupplyCoins = useAppSelector(state => state.suiLend.coins);

    const [coinType, setCoinType] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [frameworks, setFrameworks] = useState<frameworkType[]>([]);
    const [lendings, setLendings] = useState<string[]>(["Navi", "Scallop", "Bucket", "SuiLend"]);
    const [infos, setInfos] = useState<infoType[]>(lendings.map(name => {
        return {
            lending: name,
            sliderValue: 33,
            amount: ""
        }
    }));

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

    const clickToChangeAmount = (div: number) => {
        const coin = coins.find(coin => coin.coinType === coinType);
        const amount = coin ? coin.value : 0;
        const decimals = coin ? coin.decimals : 1000000;
        setAmount((amount / div / decimals).toString());
        updateSliderAmount((amount / div / decimals).toString(), infos);
    }

    const updateSliderAmount = (amount: string, newInfos: infoType[]) => {
        const coin = coins.find(coin => coin.coinType === coinType);
        if (!coin) {
            setInfos(newInfos);
            return;
        }
        const totalAmount = Number(amount) * coin.decimals;
        let usedAmount = 0;
        let totalValue = 0;
        const sliderValues = newInfos.map(info => {
            totalValue += info.sliderValue;
            return info.sliderValue;
        });
        const amounts = sliderValues.map((value, index) => {
            if (index + 1 === sliderValues.length)
                return totalAmount - usedAmount;
            const amount = Math.floor(totalAmount * value / totalValue);
            usedAmount += amount;
            return amount;
        });
        setInfos(newInfos.map((info, index) => {
            return {
                lending: info.lending,
                sliderValue: info.sliderValue,
                amount: amounts[index].toString()
            }
        }));
    }

    const checkCoinType = (type: string, coins: supplyCoinType[]) => {
        return coins.find(coin => coin.coinType === type) !== undefined;
    }

    const updateLendings = (type: string) => {
        const lendings: string[] = [];
        if (checkCoinType(type, naviSupplyCoins))
            lendings.push("Navi");
        if (checkCoinType(type, scallopSupplyCoins))
            lendings.push("Scallop");
        if (checkCoinType(type, bucketSupplyCoins))
            lendings.push("Bucket");
        if (checkCoinType(type, suiLendSupplyCoins))
            lendings.push("SuiLend");
        setLendings(lendings);
    }

    const getApr = (name: string, type: string) => {
        if (!name || !type)
            return 99999.99;
        const coins =
            name === "Navi" ? naviSupplyCoins :
                (name === "Scallop" ? scallopSupplyCoins :
                    (name === "Bucket" ? bucketSupplyCoins : suiLendSupplyCoins));
        const coin = coins.find(coin => coin.coinType === type);
        return coin ? coin.apr : 99999.99;
    }

    const handleChangeSlider = (lending: string, nums: number[]) => {
        const newInfos = infos.map(info => info.lending !== lending ? info : {
            lending: info.lending,
            sliderValue: nums[0],
            amount: ""
        });
        updateSliderAmount(amount, newInfos);
    }

    return (
        <div className="flex justify-around items-center w-full h-full font-mono">
            <div className="flex flex-col gap-6 items-center w-1/2 min-w-[550px] rounded-4xl border border-[#0a0e0f] p-3">
                <h3 className="font-bold text-3xl my-1">Strategy</h3>
                <div className="flex flex-col gap-1 w-full px-6">
                    <div className="flex justify-between">
                        <Select value={coinType} onValueChange={type => {
                            setCoinType(type);
                            setAmount("");
                            updateLendings(type);
                            updateSliderAmount("", infos);
                        }}>
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
                               value={amount}
                               onChange={e => {
                                   setAmount(e.target.value);
                                   updateSliderAmount(e.target.value, infos);
                               }} />
                    </div>
                    <div className="flex justify-between self-end w-56 px-1">
                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                onClick={() => clickToChangeAmount(4)}>
                            1/4
                        </Button>
                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                onClick={() => clickToChangeAmount(2)}>
                            1/2
                        </Button>
                        <Button variant="outline" className="w-12 h-6 cursor-pointer"
                                onClick={() => clickToChangeAmount(1)}>
                            Max
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-full px-6">
                    {lendings.map(name => {
                        const info = infos.find(info => info.lending === name)!;
                        const coin = coins.find(coin => coin.coinType === coinType);
                        const decimals = coin ? coin.decimals : 1000000;
                        const apr = getApr(name, coinType);

                        return (
                            <div className="flex justify-between" key={name}>
                                <div className="flex gap-3">
                                    <span className="w-20">{name}</span>
                                    <span className="w-24 text-right">{apr}%</span>
                                    <Slider className="w-36 cursor-pointer"
                                            value={[info.sliderValue]} min={0} max={100} step={0.01}
                                            onValueChange={nums => handleChangeSlider(name, nums)} />
                                </div>
                                <Input className="w-28 h-full"
                                       value={!info.amount ? info.amount : (Number(info.amount) / decimals).toFixed(2)}
                                       disabled />
                            </div>
                        );
                    })}
                </div>
                <Button className="self-end w-36 h-8 cursor-pointer font-sans mr-3 mb-3">Supply</Button>
            </div>
        </div>
    );
}