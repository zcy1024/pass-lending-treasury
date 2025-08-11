'use client'

import { useEffect, useState } from "react";
import { useAppSelector, AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { setProgressValue } from "@/store/modules/info";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export default function Loading() {
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const value = useAppSelector(state => state.info.progressValue);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (value < 100)
            return;
        const timer = setTimeout(() => dispatch(setProgressValue(-1)), 1000);
        setIsClosing(true);
        return () => clearTimeout(timer);
    }, [dispatch, value]);

    return (
        <div className={"absolute w-full h-full left-0 top-0 z-[1024] transition-opacity duration-1000 " + (isClosing ? "opacity-0" : "opacity-100")}>
            <div className="absolute w-full h-full left-0 top-0 bg-[#0a0e0f] opacity-60"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col gap-10 items-center">
                    <div className="animate-bounce">
                        <Image src="/hoh-logo.png" alt="HOH Logo" width={150} height={150} priority className="animate-rotate" />
                    </div>
                    <Progress value={value} className="w-96" />
                </div>
            </div>
        </div>
    );
}