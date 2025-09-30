'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/store";

export default function InviteInfo() {
    const [code, setCode] = useState<string>("");
    const info = useAppSelector(state => state.leaderboard);

    return (
        <div className="flex flex-col gap-2 w-full px-10">
            {
                !info.hadInviter &&
                <div className="flex gap-2 items-center">
                    <span>Inviter:</span>
                    <Input className="w-20 h-6 text-center"
                           type="text" maxLength={6} placeholder="Code"
                           value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                    <Button className="cursor-pointer h-6 ml-6">Confirm</Button>
                    <span className="font-sans text-xs text-[#afb3b5]">Once set, it cannot be changed.</span>
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