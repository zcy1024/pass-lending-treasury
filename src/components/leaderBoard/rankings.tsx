'use client'

import { ChevronsLeft, ChevronsRight, Copy, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";

export default function Rankings() {
    const [page, setPage] = useState<number>(0);
    const [jump, setJump] = useState<string>("");
    const [jumpValid, setJumpValid] = useState<boolean>(false);
    const infos = useAppSelector(state => state.leaderboard.infos);

    useEffect(() => {
        if (!jump) {
            setJumpValid(false);
            return;
        }
        const num = Math.floor(Number(jump));
        setJumpValid(num >= 1 && num <= Math.floor(infos.length / 15) + 1);
    }, [jump, infos]);

    const handleJump = () => {
        if (!jumpValid)
            return;
        setPage(Math.floor(Number(jump)) - 1);
    }

    return (
        <div className="flex flex-col w-full h-full font-mono px-10">
            <div className="flex justify-between items-center">
                <span className="w-36">RANK</span>
                <span className="w-60 text-center">ADDRESS</span>
                <span className="w-36 text-right">TOTAL POINTS</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 py-1">
                {infos.slice(page * 15, page * 15 + 15).map((info, index) => {
                    return (
                        <div className="flex justify-between items-center" key={index}>
                            <span className="w-36">#{page * 15 + index + 1}</span>
                            <div className="flex justify-center gap-2 items-center w-60 text-center">
                                <span>{info.address.slice(0, 6) + "..." + info.address.slice(-4)}</span>
                                <Copy size={16} className="cursor-pointer active:text-[#196ae3]"
                                      onClick={() => navigator.clipboard.writeText(info.address)} />
                            </div>
                            <span className="w-36 text-right">{info.reward + info.points}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-3 items-center self-end">
                <Button variant="outline" className="h-8 cursor-pointer"
                        onClick={() => setPage(page === 0 ? 0 : page - 1)}>
                    <ChevronsLeft />
                </Button>
                <Button variant="outline" className={"h-8 cursor-pointer " + (page === 0 ? "bg-[#afb3b5] opacity-50" : "")}
                        onClick={() => setPage(page === 0 ? 0 : page - 1)}>
                    {page === 0 ? 1 : page}
                </Button>
                <Button variant="outline" className={"h-8 cursor-pointer " + (page !== 0 ? "bg-[#afb3b5] opacity-50" : "")}
                        onClick={() => setPage(page === 0 ? 1 : page)}
                        disabled={page >= Math.floor(infos.length / 15)}>
                    {page === 0 ? 2 : page + 1}
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer"
                        onClick={() => setPage(page === 0 ? 2 : page + 1)}
                        disabled={page >= Math.floor(infos.length / 15)}>
                    {page === 0 ? 3 : page + 2}
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer"
                        onClick={() => setPage(page === Math.floor(infos.length / 15) ? Math.floor(infos.length / 15) : page + 1)}>
                    <ChevronsRight />
                </Button>
                <div className="flex gap-2 items-center text-xs font-sans">
                    <span>Total pages {Math.floor(infos.length / 15) + 1}, jump to </span>
                    <Input className="w-16 h-8" type="number" value={jump} onChange={e => setJump(e.target.value)} />
                    <CornerDownLeft size={16} onClick={handleJump}
                                    className={jumpValid ? "cursor-pointer" : "text-[#afb3b5]"} />
                </div>
            </div>
        </div>
    );
}