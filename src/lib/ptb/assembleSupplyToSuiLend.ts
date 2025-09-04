import { Transaction } from "@mysten/sui/transactions";
import { supplyToSuiLendType } from "@/store/modules/tx";
import { LENDING_MARKET_ID, LENDING_MARKET_TYPE, SuilendClient } from "@suilend/sdk";
import { suiClient } from "@/configs/networkConfig";
import { getCoin } from "@/lib/ptb/index";

async function checkExistingObligations(sender: string) {
    try {
        return await SuilendClient.getObligationOwnerCaps(
            sender,
            [LENDING_MARKET_TYPE],
            suiClient
        );
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function assembleSupplyToSuiLend(tx: Transaction, sender: string, transaction: supplyToSuiLendType) {
    const suiLendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient
    );
    const existingCaps = await checkExistingObligations(sender);
    let obligationOwnerCap;
    if (existingCaps.length === 0)
        obligationOwnerCap = suiLendClient.createObligation(tx);
    else
        obligationOwnerCap = existingCaps[0].id;
    for (const i in transaction.coinTypes) {
        const type = transaction.coinTypes[i];
        const amount = transaction.values[i];
        suiLendClient.deposit(
            getCoin(tx, type, Math.floor(amount)),
            type,
            obligationOwnerCap,
            tx
        );
    }
    if (existingCaps.length === 0)
        tx.transferObjects([obligationOwnerCap], tx.pure.address(sender));
    return;
}