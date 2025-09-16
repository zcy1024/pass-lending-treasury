import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromSuiLendType } from "@/store/modules/tx";
import { initializeSuilend, LENDING_MARKET_ID, LENDING_MARKET_TYPE, SuilendClient } from "@suilend/sdk";
import { suiClient } from "@/configs/networkConfig";
import { extraCoinType } from "@/lib/ptb/index";

export default async function assembleWithdrawFromSuiLend(tx: Transaction, sender: string, transaction: withdrawFromSuiLendType) {
    const suiLendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient
    );
    const {
        // lendingMarket,
        // coinMetadataMap,
        //
        // refreshedRawReserves,
        reserveMap,
        // reserveCoinTypes,
        // reserveCoinMetadataMap,
        //
        // rewardCoinTypes,
        // activeRewardCoinTypes,
        // rewardCoinMetadataMap,
    } = await initializeSuilend(suiClient, suiLendClient);
    const obligationOwnerCaps = await SuilendClient.getObligationOwnerCaps(
        sender,
        [LENDING_MARKET_TYPE],
        suiClient
    );
    const obligationOwnerCap = obligationOwnerCaps[0];
    const obligation = await SuilendClient.getObligation(
        obligationOwnerCap.obligationId,
        [LENDING_MARKET_TYPE],
        suiClient
    );
    await suiLendClient.refreshAll(tx, obligation);
    const extraCoins: extraCoinType[] = [];
    const usedTypes: string[] = [];
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const rate = reserveMap[type  === "0x2::sui::SUI" ? "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" : type].cTokenExchangeRate.toNumber();
        if (usedTypes.findIndex(usedType => usedType === type) !== -1)
            continue;
        usedTypes.push(type);
        let amount = 0;
        for (let j = Number(i); j < transaction.coinTypes.length; j++)
            if (transaction.coinTypes[j] === type)
                amount += Math.floor(transaction.values[j]);
        extraCoins.push({
            coin: await suiLendClient.withdraw(
                obligationOwnerCap.id,
                obligationOwnerCap.obligationId,
                type,
                (Math.floor(amount / rate)).toString(),
                tx
            ),
            coinType: type,
            amount,
            used: false
        });
    }
    return extraCoins;
}