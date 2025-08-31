'use client'

import { rewardCoinType, withdrawCoinType } from "@/store/modules/navi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RewardsDetail, ScallopRewardsDetail } from "@/components";
import { useEffect, useState } from "react";
import { AppDispatch, useAppSelector } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { useDispatch } from "react-redux";
import {
    claimFromNaviAndResupplyType,
    claimFromNaviType,
    updateTransactionsInfo,
    withdrawFromNaviType, withdrawFromScallopType
} from "@/store/modules/tx";

export default function WithdrawCard({title, withdrawCoins, rewardCoins}: {
    title: string,
    withdrawCoins: withdrawCoinType[],
    rewardCoins: rewardCoinType[],
}) {
    const dispatch = useDispatch<AppDispatch>();
    const coins = useAppSelector(state => state.info.realCoins);
    const regionCoins = useAppSelector(state => state.info.coins);
    const transactions = useAppSelector(state => state.tx.transactions);

    const [supplied, setSupplied] = useState<number[]>([]);
    useEffect(() => {
        setSupplied(withdrawCoins.map(coin => {
            let value = 0;
            const keyword = title === "NAVI Protocol" ? "Navi" : "Scallop";
            const withdraw = transactions.filter(transaction => transaction.type === `withdrawFrom${keyword}`);
            withdraw.forEach(tx => tx.coinTypes.forEach((type, index) => {
                if (type === coin.coinType)
                    value += tx.values[index];
            }));
            return coin.supplied - value;
        }));
    }, [withdrawCoins, title, transactions]);

    const [withdrawInfos, setWithdrawInfos] = useState<{
        coinType: string,
        amount: string,
        withdrawAmount: string
    }[]>([]);
    const [isValid, setIsValid] = useState<boolean>(true);

    const [claimed, setClaimed] = useState<boolean>(false);
    useEffect(() => {
        const keyword = title === "NAVI Protocol" ? "Navi" : "Scallop";
        setClaimed(transactions.find(transaction => transaction.type === `claimFrom${keyword}` || transaction.type === `claimFrom${keyword}AndResupply`) !== undefined);
    }, [title, transactions]);

    const getWithdrawAmount = (type: string) => {
        const index = withdrawInfos.findIndex(info => info.coinType === type);
        return index === -1 ? "" : withdrawInfos[index].amount;
    }

    const updateWithdrawInfo = (type: string, amount: string) => {
        const coin = withdrawCoins.find(coin => coin.coinType === type)!;
        const info = coins.find(info => info.coinType === type)!;
        const withdrawAmount = coin.withdrawAmount ? (Math.floor(coin.withdrawAmount * Number(amount) * info.decimals / coin.supplied) / info.decimals).toString() : amount;
        setWithdrawInfos([
            ...withdrawInfos.filter(info => info.coinType !== type),
            {
                coinType: type,
                amount,
                withdrawAmount
            }
        ]);
    }

    const isInvalidWithdrawAmount = (type: string) => {
        const input = getWithdrawAmount(type);
        const index = withdrawCoins.findIndex(coin => coin.coinType === type);
        const coinIndex = coins.findIndex(coin => coin.coinType === type);
        return !input || index === -1 || Number(input) === 0 || Number(input) * coins[coinIndex].decimals > supplied[index];
    }

    const addTransaction = () => {
        const validList = withdrawInfos.filter(item => !isInvalidWithdrawAmount(item.coinType));
        const matchedCoinIndex = validList.map(item => coins.findIndex(coin => coin.coinType === item.coinType));
        if (validList.length === 0 || matchedCoinIndex.find(index => index === -1)) {
            setIsValid(false);
            return;
        }
        let isValid: boolean;
        if (title.match("NAVI")) {
            isValid = dispatch(updateTransactionsInfo(regionCoins, transactions.concat([{
                type: "withdrawFromNavi",
                coinTypes: validList.map(item => item.coinType),
                names: matchedCoinIndex.map(idx => coins[idx].name),
                decimals: matchedCoinIndex.map(idx => coins[idx].decimals),
                values: validList.map((item, idx) => Number(item.amount) * coins[matchedCoinIndex[idx]].decimals)
            } as withdrawFromNaviType])));
        } else {
            isValid = dispatch(updateTransactionsInfo(regionCoins, transactions.concat([{
                type: "withdrawFromScallop",
                coinTypes: validList.map(item => item.coinType),
                names: matchedCoinIndex.map(idx => coins[idx].name),
                decimals: matchedCoinIndex.map(idx => coins[idx].decimals),
                values: validList.map((item, idx) => Number(item.amount) * coins[matchedCoinIndex[idx]].decimals),
                marketTypes: validList.map(item => `0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::reserve::MarketCoin<${item.coinType}>`),
                withdrawValues: validList.map((item, idx) => Number(item.withdrawAmount) * coins[matchedCoinIndex[idx]].decimals)
            } as withdrawFromScallopType])));
        }
        if (!isValid) {
            setIsValid(false);
            return;
        }
        setWithdrawInfos([]);
        setIsValid(true);
    }

    const claimRewards = () => {
        dispatch(updateTransactionsInfo(regionCoins, transactions.concat([{
            type: "claimFromNavi",
            coinTypes: rewardCoins.map(item => item.coinType),
            names: rewardCoins.map(item => item.name),
            decimals: rewardCoins.map(item => item.decimals),
            values: rewardCoins.map((item, index) => item.reward * rewardCoins[index].decimals)
        } as claimFromNaviType])));
    }

    const claimRewardsAndResupply = () => {
        dispatch(updateTransactionsInfo(regionCoins, transactions.concat([{
            type: "claimFromNaviAndResupply",
            coinTypes: [],
            names: [],
            decimals: [],
            values: []
        } as claimFromNaviAndResupplyType])));
    }

    return (
        <div className="font-mono">
            <h3 className="font-bold text-xl my-1">{title}</h3>
            <hr />
            {withdrawCoins.map((coin, index) => {
                const ownedCoinIndex = coins.findIndex(info => info.coinType === coin.coinType);
                const decimals = ownedCoinIndex === -1 ? 1 : coins[ownedCoinIndex].decimals;

                return (
                    <div key={index} className="flex justify-between items-center px-10 m-1">
                        <div className="flex gap-1 items-center">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={coin.src} alt={coin.alt} />
                                <AvatarFallback>{coin.fallback}</AvatarFallback>
                            </Avatar>
                            <h4 className="font-bold">{coin.name}</h4>
                        </div>
                        <div className="flex gap-10 items-center">
                            <span className="text-xs text-[#afb3b5]">{title.match("Scallop") ? `s${coin.name}` : "Supplied"}: {(supplied[index] / decimals).toFixed(2)}</span>
                            <div className="flex gap-2 items-center">
                                <Input className="h-full" type="number" placeholder="Withdraw Coin Value"
                                       value={getWithdrawAmount(coin.coinType)}
                                       onChange={e => updateWithdrawInfo(coin.coinType, e.target.value)} />
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (supplied[index] / 4 / decimals).toString())}>
                                    1/4
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (supplied[index] / 2 / decimals).toString())}>
                                    1/2
                                </Button>
                                <Button className="w-16 h-6 cursor-pointer font-sans" variant="outline"
                                        onClick={() => updateWithdrawInfo(coin.coinType, (supplied[index] / decimals).toString())}>
                                    Max
                                </Button>
                                <Check color="green" size={36}
                                       className={"transition-opacity " + (isInvalidWithdrawAmount(coin.coinType) ? "opacity-0" : "opacity-100")} />
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex flex-row-reverse gap-3 items-center px-5 mt-2">
                <Button className="w-36 h-8 cursor-pointer font-sans"
                        disabled={!withdrawCoins.find(coin => !isInvalidWithdrawAmount(coin.coinType))}
                        onClick={addTransaction}>
                    Withdraw
                </Button>
                {
                    title === "Scallop" &&
                    <ScallopRewardsDetail title={title} withdrawCoins={withdrawCoins} />
                }
                <span className="text-xs font-sans text-red-600">{isValid ? "" : "error withdraw"}</span>
            </div>
            {
                title === "NAVI Protocol" &&
                <div className="flex gap-3 justify-end items-center px-5 mt-2">
                    <RewardsDetail title={title} rewardCoins={rewardCoins} />
                    <Button className="w-36 h-8 cursor-pointer font-sans"
                            disabled={rewardCoins.length === 0 || claimed}
                            onClick={claimRewards}>
                        Claim Reward
                    </Button>
                    <Button className="w-36 h-8 cursor-pointer font-sans"
                            disabled={rewardCoins.length === 0 || claimed}
                            onClick={claimRewardsAndResupply}>
                        Claim And ReSupply
                    </Button>
                </div>
            }
            <hr className="my-5" />
        </div>
    );
}