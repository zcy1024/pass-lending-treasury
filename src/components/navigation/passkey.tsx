'use client'

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/store";
import { refreshAll, setProgressValue } from "@/store/modules/info";
import { randomTwentyFive } from "@/lib/utils";
import { getPasskeyProvider } from "@/configs/passkey";
import { findCommonPublicKey, PasskeyKeypair } from "@mysten/sui/keypairs/passkey";
import { PublicKey } from "@mysten/sui/cryptography";
import { suiClient } from "@/configs/networkConfig";
import { Copy } from "lucide-react";

export default function PassKey() {
    const dispatch = useDispatch<AppDispatch>();
    const address = useAppSelector(state => state.info.address);

    const loadWalletFinalization = (address: string, publicKeyBytes: Uint8Array) => {
        dispatch(setProgressValue(50 + randomTwentyFive()));
        localStorage.setItem("sui_passkey_data", JSON.stringify({
            address: address,
            publicKeyBytes: Array.from(publicKeyBytes)
        }));
        dispatch(refreshAll(publicKeyBytes));
        dispatch(setProgressValue(100));
    }

    const handleCreateWallet = async () => {
        dispatch(setProgressValue(25 + randomTwentyFive()));
        try {
            const passkeyProvider = getPasskeyProvider(window.location.hostname);
            const passkey = await PasskeyKeypair.getPasskeyInstance(passkeyProvider);
            loadWalletFinalization(passkey.toSuiAddress(), passkey.getPublicKey().toRawBytes());
        } catch (err) {
            console.error(err);
            dispatch(setProgressValue(100));
        }
    }

    const objToConfirm = async (pks: PublicKey[]) => {
        const finalPks: PublicKey[] = [];
        for (const pk of pks) {
            const res = await suiClient.getOwnedObjects({
                owner: pk.toSuiAddress()
            });
            if (res.data.length > 0)
                finalPks.push(pk);
        }
        return finalPks;
    }

    const handleLoadWallet = async () => {
        dispatch(setProgressValue(25 + randomTwentyFive()));
        try {
            const passkeyProvider = getPasskeyProvider(window.location.hostname);

            const testMessage = new TextEncoder().encode("Hello Pass Lending Treasury!");
            const possiblePks = await PasskeyKeypair.signAndRecover(passkeyProvider, testMessage);

            const sendTestMessage2 = async () => {
                const testMessage2 = new TextEncoder().encode("Hello Pass Lending Treasury 2!!!");
                return await PasskeyKeypair.signAndRecover(passkeyProvider, testMessage2);
            }

            const pksWithObj = await objToConfirm(possiblePks);

            const commonPk = pksWithObj.length === 1 ? pksWithObj[0] : findCommonPublicKey(possiblePks, await sendTestMessage2());

            const passkey = new PasskeyKeypair(commonPk.toRawBytes(), passkeyProvider);
            loadWalletFinalization(passkey.toSuiAddress(), passkey.getPublicKey().toRawBytes());
        } catch (err) {
            console.error(err);
            dispatch(setProgressValue(100));
        }
    }

    return (
        <div className="flex gap-10 items-center">
            <div className="flex gap-3 items-center">
                <span>{address ? address.slice(0, 6) + "..." + address.slice(-4) : ""}</span>
                {
                    address &&
                    <Copy size={16} className="cursor-pointer active:text-[#196ae3]"
                          onClick={() => navigator.clipboard.writeText(address)} />
                }
            </div>
            <Button variant="ghost" className="cursor-pointer"
                    onClick={handleCreateWallet}>
                Create Passkey Wallet
            </Button>
            <Button variant="ghost" className="cursor-pointer"
                    onClick={handleLoadWallet}>
                Load Passkey Wallet
            </Button>
        </div>
    );
}