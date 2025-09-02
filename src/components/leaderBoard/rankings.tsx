'use client'

import { ChevronsLeft, ChevronsRight, Copy, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Rankings() {
    return (
        <div className="flex flex-col w-full h-full font-mono px-10">
            <div className="flex justify-between items-center">
                <span className="w-36">RANK</span>
                <span className="w-60 text-center">ADDRESS</span>
                <span className="w-36 text-right">TOTAL POINTS</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 py-1">
                {Array.from({ length: 16 }).map((_, index) => {
                    return (
                        <div className="flex justify-between items-center" key={index}>
                            <span className="w-36">#999999999</span>
                            <div className="flex justify-center gap-2 items-center w-60 text-center">
                                <span>0x38c2...9648</span>
                                <Copy size={16} className="cursor-pointer active:text-[#196ae3]"
                                      onClick={() => navigator.clipboard.writeText("Test Code")} />
                            </div>
                            <span className="w-36 text-right">999999999</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-3 items-center self-end">
                <Button variant="outline" className="h-8 cursor-pointer">
                    <ChevronsLeft />
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer bg-[#afb3b5] opacity-50">
                    1
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer">
                    2
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer">
                    3
                </Button>
                <Button variant="outline" className="h-8 cursor-pointer">
                    <ChevronsRight />
                </Button>
                <div className="flex gap-2 items-center text-xs font-sans">
                    <span>Total pages 666, jump to </span>
                    <Input className="w-16 h-8" type="number" />
                    <CornerDownLeft size={16} color="#afb3b5" />
                </div>
            </div>
        </div>
    );
}