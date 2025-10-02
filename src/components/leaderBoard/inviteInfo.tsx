'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { AppDispatch, useAppSelector } from "@/store";
import { Transaction } from "@mysten/sui/transactions";
import assembleSetInviter from "@/lib/ptb/leaderboard/assembleSetInviter";
import devRunLeaderboardTransaction from "@/lib/ptb/leaderboard/devRunLeaderboardTransaction";
import assembleCreateUser from "@/lib/ptb/leaderboard/assembleCreateUser";
import assembleLeaderboardPTB from "@/lib/ptb/leaderboard";
import { useDispatch } from "react-redux";
import { initProgress, refreshAll, setProgressValue } from "@/store/modules/info";
import { randomTwentyFive } from "@/lib/utils";
import { network, networkConfig } from "@/configs/networkConfig";
import { getPasskeyKeypair } from "@/configs/passkey";

export default function InviteInfo() {
    const [code, setCode] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();
    const info = useAppSelector(state => state.leaderboard.info);
    const address = useAppSelector(state => state.info.address);
    const publicKeyArray = useAppSelector(state => state.info.publicKeyArray);

    const signMessage = async () => {
        const keypair = getPasskeyKeypair(window.location.hostname, new Uint8Array(publicKeyArray));
        await keypair.signPersonalMessage(new TextEncoder().encode("Sign to set inviter."));
    }

    const handleConfirmCode = async () => {
        dispatch(setProgressValue(0));
        try {
            const tx = new Transaction();
            await assembleCreateUser(tx, address);
            assembleSetInviter(tx, address, code);
            const isValid = await devRunLeaderboardTransaction(tx, address);
            dispatch(setProgressValue(randomTwentyFive()));
            setIsValid(isValid);
            if (!isValid) {
                dispatch(setProgressValue(100));
                return;
            }
            await signMessage();
            await assembleLeaderboardPTB(["invite"], address, code, 0, networkConfig[network].variables.Leaderboard);
            dispatch(refreshAll(new Uint8Array(publicKeyArray)));
            dispatch(initProgress());
            setCode("");
        } catch (e) {
            console.error(e);
            dispatch(setProgressValue(100));
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full px-10">
            {
                !info.hadInviter &&
                <div className="flex gap-2 items-center">
                    <span>Inviter:</span>
                    <Input className="w-20 h-6 text-center"
                           type="text" maxLength={6} placeholder="Code"
                           value={code} onChange={(e) => {
                               setCode(e.target.value.toUpperCase());
                               setIsValid(true);
                           }} />
                    <Button className="cursor-pointer h-6 ml-6" disabled={!code || code.length !== 6 || !isValid || !address}
                            onClick={handleConfirmCode}>
                        Confirm
                    </Button>
                    {
                        isValid &&
                        <span className="font-sans text-xs text-[#afb3b5]">Once set, it cannot be changed.</span> ||
                        <span className="font-sans text-xs text-red-500">Please enter a valid invitation code.</span>
                    }
                </div>
            }
            <div className="flex gap-2 items-center">
                <span>Your invitation code:</span>
                <Input className="w-20 h-6 text-center" defaultValue={info.code ? info.code : "------"} disabled />
                {
                    info.code &&
                    <Copy size={16} className="cursor-pointer active:text-[#196ae3]"
                          onClick={() => navigator.clipboard.writeText("Test Code")} />
                }
                {/*<Button className="cursor-pointer h-6 ml-6" variant="outline">Create Code</Button>*/}
            </div>
            <div className="flex gap-10 items-center">
                <div className="flex gap-2 items-center">
                    <span>Invited:</span>
                    <Input className="w-20 h-6 text-center" defaultValue={info.invited} disabled />
                </div>
                <div className="flex gap-2 items-center">
                    <span>Points reward:</span>
                    <Input className="w-20 h-6 text-center" defaultValue={info.reward} disabled />
                </div>
            </div>
        </div>
    );
}