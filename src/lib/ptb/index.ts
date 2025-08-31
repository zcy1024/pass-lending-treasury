import {
    isClaimFromNaviAndResupplyType,
    isClaimFromNaviType,
    isSupplyToNaviType, isSupplyToScallopType,
    isTransferType,
    isWithdrawFromNaviType, isWithdrawFromScallopType,
    transactionType
} from "@/store/modules/tx";
import { coinWithBalance, Transaction, TransactionResult } from "@mysten/sui/transactions";
import assembleTransfer from "@/lib/ptb/assembleTransfer";
import { suiClient } from "@/configs/networkConfig";
import assembleSupplyToNavi from "@/lib/ptb/assembleSupplyToNavi";
import assembleWithdrawFromNavi from "@/lib/ptb/assembleWithdrawFromNavi";
import assembleClaimFromNavi from "@/lib/ptb/assembleClaimFromNavi";
import assembleClaimFromNaviAndResupply from "@/lib/ptb/assembleClaimFromNaviAndResupply";
import assembleSupplyToScallop from "@/lib/ptb/assembleSupplyToScallop";
import assembleWithdrawFromScallop from "@/lib/ptb/assembleWithdrawFromScallop";

export type extraCoinType = {
    coin: TransactionResult,
    coinType: string,
    amount: number,
    used: boolean
}

const extraCoins: extraCoinType[] = [];

export function getCoin(tx: Transaction, type: string, amount: number) {
    if (extraCoins.filter(item => !item.used && item.coinType === type).length === 0)
        return coinWithBalance({
            type,
            balance: amount,
            useGasCoin: type === "0x2::sui::SUI"
        });
    let need = amount;
    const desCoin = coinWithBalance({
        type,
        balance: 0
    });
    for (const i in extraCoins) {
        const coin = extraCoins[i];
        if (coin.used || coin.coinType !== type)
            continue;
        if (need >= coin.amount) {
            tx.mergeCoins(desCoin, [coin.coin]);
            coin.used = true;
            need -= coin.amount;
        } else {
            tx.mergeCoins(desCoin, tx.splitCoins(coin.coin, [need]));
            coin.amount -= need;
            need = 0;
        }
        if (need === 0)
            break;
    }
    if (need > 0)
        tx.mergeCoins(desCoin, [coinWithBalance({
            type,
            balance: need,
            useGasCoin: type === "0x2::sui::SUI"
        })]);
    return desCoin;
}

function transferExtraCoins(tx: Transaction, extraCoins: extraCoinType[], sender: string) {
    const coins = extraCoins.filter(item => !item.used).map(item => item.coin);
    if (coins.length > 0)
        tx.transferObjects(coins, tx.pure.address(sender));
}

async function dryRun(tx: Transaction, sender: string): Promise<[boolean, number]> {
    const res = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender
    });
    if (res.effects.status.error)
        console.log("dry run error: ", res.effects.status.error);
    return [res.effects.status.status === "success", Number(res.effects.gasUsed.computationCost) + Number(res.effects.gasUsed.storageCost)];
}

export default async function assemblePTB(transactions: transactionType, sender: string): Promise<[Transaction, boolean]> {
    const tx = new Transaction();
    for (const transaction of transactions) {
        if (isTransferType(transaction))
            assembleTransfer(tx, transaction);
        else if (isSupplyToNaviType(transaction))
            await assembleSupplyToNavi(tx, transaction);
        else if (isWithdrawFromNaviType(transaction))
            extraCoins.push(...(await assembleWithdrawFromNavi(tx, transaction)));
        else if (isClaimFromNaviType(transaction))
            await assembleClaimFromNavi(tx, sender);
        else if (isClaimFromNaviAndResupplyType(transaction))
            await assembleClaimFromNaviAndResupply(tx, sender);
        else if (isSupplyToScallopType(transaction))
            assembleSupplyToScallop(tx, sender, transaction);
        else if (isWithdrawFromScallopType(transaction))
            extraCoins.push(...(assembleWithdrawFromScallop(tx, transaction)));
    }
    transferExtraCoins(tx, extraCoins, sender);
    const [success, gas] = await dryRun(tx, sender);
    // An additional fee of one thousandth
    tx.transferObjects([coinWithBalance({
        type: "0x2::sui::SUI",
        balance: Math.floor(gas / 1000),
        useGasCoin: true
    })], tx.pure.address("0x4ee352f9b259edc642cd4dd028c0ce3491d97dd01a7bb570eb16d74711e08c09"));
    return [tx, success];
}