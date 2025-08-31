import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { suiClient } from "@/configs/networkConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomTwentyFive() {
  return Math.floor(Math.random() * 25);
}

export async function getUrlInMetadata(coinType: string) {
  const res = await suiClient.getCoinMetadata({
    coinType
  });
  return res && res.iconUrl ? res.iconUrl : "";
}