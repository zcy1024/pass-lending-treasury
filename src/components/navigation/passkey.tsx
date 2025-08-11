'use client'

import { Button } from "@/components/ui/button";

export default function PassKey() {
    return (
        <div className="flex gap-10 items-center">
            <Button variant="ghost" className="cursor-pointer">Create Passkey Wallet</Button>
            <Button variant="ghost" className="cursor-pointer">Load Passkey Wallet</Button>
        </div>
    );
}