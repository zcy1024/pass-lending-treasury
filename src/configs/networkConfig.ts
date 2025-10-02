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
                Package: "0xa68b129d5496f8605a29d1d57e9968ddd67ec8a8ed3daec672bc146ac4dd75b3",
                UpgradeCap: "0x455f72e223309566d314fc2b46cab4329182bc8b787fcd73a2cc7c916e85e8ea",
                AdminCap: "0xa5207acd6b5ce43dc12736202d8f6a70ea3f0adc09ca456dd0a15256bc2c93e6",
                InfoList: "0x13471596227ffe723a15ba0de4471d11ed9e14aabc1d4c19887fc60d8554077d"
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