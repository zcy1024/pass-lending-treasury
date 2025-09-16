import { Transaction } from "@mysten/sui/transactions";
import { withdrawFromSuiLendType } from "@/store/modules/tx";
import { LENDING_MARKET_ID, LENDING_MARKET_TYPE, SuilendClient } from "@suilend/sdk";
import { suiClient } from "@/configs/networkConfig";
import { extraCoinType } from "@/lib/ptb/index";

export default async function assembleWithdrawFromSuiLend(tx: Transaction, sender: string, transaction: withdrawFromSuiLendType) {
    const suiLendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient
    );
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
                amount.toString(),
                tx
            ),
            coinType: type,
            amount,
            used: false
        });
    }
    return extraCoins;
}