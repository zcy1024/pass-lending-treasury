'use client'

import { InviteInfo, Rankings } from "@/components";

export default function LeaderBoard() {
    return (
        <div className="flex flex-col gap-3 items-center w-full h-full font-mono">
            <h2 className="text-5xl font-bold subpixel-antialiased tracking-wider">LeaderBoard</h2>
            <hr className="w-full" />
            <InviteInfo />
            <hr className="w-full" />
            <Rankings />
        </div>
    );
}