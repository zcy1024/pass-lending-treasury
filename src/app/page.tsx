'use client'

import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/store";
import { CoinList, Loading, Navigation, OpenTxCheck, Swap } from "@/components";
import { useEffect } from "react";
import { initProgress } from "@/store/modules/info";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const processValue = useAppSelector(state => state.info.progressValue);
    useEffect(() => {
        dispatch(initProgress());
    }, [dispatch]);

    return (
        <div className="relative w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation />
                <div className="relative flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    Main Content
                    <Swap />
                    <CoinList />
                </div>
            </div>
            <OpenTxCheck />
            { processValue >= 0 && <Loading /> }
        </div>
    );
}
