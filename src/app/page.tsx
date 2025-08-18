'use client'

import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/store";
import { CoinList, Loading, Navigation, OpenTxCheck, Supply, Swap, Withdraw } from "@/components";
import { useEffect } from "react";
import { initProgress, refreshAll, setCoins } from "@/store/modules/info";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const tab = useAppSelector(state => state.info.navTab);
    const processValue = useAppSelector(state => state.info.progressValue);
    useEffect(() => {
        dispatch(initProgress());
        const stored = JSON.parse(localStorage.getItem("sui_passkey_data") || "null");
        dispatch(refreshAll(!stored ? undefined : new Uint8Array(stored.publicKeyBytes)));
        dispatch(setCoins([
            {
                name: "Sui",
                value: 1000000000
            },
            {
                name: "NAVX",
                value: 100
            },
            {
                name: "SCALLOP",
                value: 999
            },
            {
                name: "BUCK",
                value: 987654
            }
        ]));
    }, [dispatch]);

    return (
        <div className="relative w-screen h-screen bg-[#f1f2f5] text-[#0a0e0f]">
            <div className="flex flex-col items-center w-full h-full">
                <Navigation />
                <div className="relative flex-1 w-full min-w-[1024px] px-32 xl:px-64 2xl:px-96 py-10 overflow-y-scroll">
                    {tab === "Supply" ? <Supply /> : <Withdraw />}
                    <Swap />
                    <CoinList />
                </div>
            </div>
            <OpenTxCheck />
            { processValue >= 0 && <Loading /> }
        </div>
    );
}
