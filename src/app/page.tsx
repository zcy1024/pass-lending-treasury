'use client'

import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/store";
import { Loading } from "@/components";
import { useEffect } from "react";
import { initProgress } from "@/store/modules/info";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const processValue = useAppSelector(state => state.info.progressValue);
    useEffect(() => {
        dispatch(initProgress());
    }, [dispatch]);

    return (
        <div>
            { processValue >= 0 && <Loading /> }
        </div>
    );
}
