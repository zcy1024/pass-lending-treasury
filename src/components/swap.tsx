'use client'

import { useAppSelector, AppDispatch } from "@/store";
import { useEffect } from "react";
import { swapPanelClient } from "@/configs/astros";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { getPasskeyKeypair } from "@/configs/passkey";
import { suiClient } from "@/configs/networkConfig";
import { useDispatch } from "react-redux";
import { refreshAll } from "@/store/modules/info";

export default function Swap() {
    const dispatch = useDispatch<AppDispatch>();
    const address = useAppSelector(state => state.info.address);
    const publicKeyArray = useAppSelector(state => state.info.publicKeyArray);

    useEffect(() => {
        swapPanelClient.setUserAddress(address ? address : "").then();
        swapPanelClient.onSignTransaction = async (tx) => {
            const bytes = await tx.build({
                // @ts-expect-error #private client
                client: suiClient
            });
            const keypair = getPasskeyKeypair(window.location.hostname, new Uint8Array(publicKeyArray));
            const res = await keypair.signTransaction(bytes);
            return {
                signature: res.signature,
                bytes: res.bytes
            }
        }
    }, [address, publicKeyArray]);

    useEffect(() => {
        if (publicKeyArray.length !== 33)
            return;
        swapPanelClient.events.on("swapSuccess", res => {
            console.log("swap success: ", res);
            dispatch(refreshAll(new Uint8Array(publicKeyArray)));
        });
    }, [dispatch, publicKeyArray]);

    return (
        <Button variant="outline"
                className="flex gap-2 self-end cursor-pointer"
                onClick={() => swapPanelClient.show()}>
            <ArrowUpDown />
            <span>Swap</span>
        </Button>
    );
}