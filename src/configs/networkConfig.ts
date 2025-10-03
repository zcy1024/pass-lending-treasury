'use client'

import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

const network = "mainnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            Package: "",
            Publisher: "",
            UpgradeCap: "",
            Scallop: {
                Package: "0x83bbe0b3985c5e3857803e2678899b03f3c4a31be75006ab03faf268c014ce41",
                Version: "0x07871c4b3c847a0f674510d4978d5cf6f960452795e8ff6f189fd2088a3f6ac7",
                Market: "0xa757975255146dc9686aa823b7838b507f315d704f428cbadad2f4ea061939d9"
            },
            Leaderboard: {
                Package: "0x09cbc83f451252618290d0a808e8c5eede4c3747fed28f78e52afce4f285c973",
                UpgradeCap: "0x3747f8d504e5db8ef7818f7b562af742e106aa0caa70097564ff4aca1daad788",
                AdminCap: "0x1b49a19d977e03cd0517f3a74cf7307a3681649955bf3db84c1da46d8a9c8a98",
                InfoList: "0x0cacec884810e2ee3597afc725992da7195dae5d468ebd7332bf061943fa989c"
            }
        }
    }
});

const suiClient = new SuiClient({
    url: networkConfig[network].url
});

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables() {
    return networkConfig[network].variables;
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables();
        return fn(tx, networkVariables, params);
    }
}

export type {
    NetworkVariables
}

export {
    network,
    useNetworkVariable,
    useNetworkVariables,
    networkConfig,
    suiClient,
    createBetterTxFactory
}