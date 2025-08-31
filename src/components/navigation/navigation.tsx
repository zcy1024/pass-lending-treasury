'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/store";
import { setNavTab } from "@/store/modules/info";
import { PassKey } from "@/components";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function Navigation() {
    const navTab = useAppSelector(state => state.info.navTab);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex justify-between items-center h-16 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 bg-[#222] text-[#afb3b5]">
            <div className="flex gap-10 items-center">
                <Avatar>
                    <AvatarImage src="/pass-lending-treasury.png" alt="pass lending treasury logo" />
                    <AvatarFallback>Sui</AvatarFallback>
                </Avatar>
                <Tabs defaultValue="Supply" value={navTab} className="w-40" onValueChange={value => dispatch(setNavTab(value))}>
                    <TabsList className="h-16 w-full bg-[#222]">
                        <HoverCard openDelay={100}>
                            <HoverCardTrigger className="w-full h-full">
                                <TabsTrigger value="Supply" className={"cursor-pointer text-[#afb3b5] transition-all duration-500 data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white " + (navTab === "Supply" || navTab === "Withdraw" || navTab === "Strategy" ? "bg-[#0f0f0f] text-white" : "")}>Lending</TabsTrigger>
                            </HoverCardTrigger>
                            <HoverCardContent className="bg-[#222] w-36">
                                <div className="flex flex-col gap-3 items-center">
                                    <TabsTrigger value="Supply" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Supply</TabsTrigger>
                                    <TabsTrigger value="Withdraw" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Withdraw</TabsTrigger>
                                    <TabsTrigger value="Strategy" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">Strategy</TabsTrigger>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        <TabsTrigger value="LeaderBoard" className="cursor-pointer text-[#afb3b5] data-[state=active]:bg-[#0f0f0f] data-[state=active]:text-white transition-all duration-500">LeaderBoard</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <PassKey />
        </div>
    );
}