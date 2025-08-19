'use client'

import { BrowserPasskeyProvider, BrowserPasswordProviderOptions, PasskeyKeypair } from "@mysten/sui/keypairs/passkey";

const passkeySavedName = "Pass Lending Treasury";
const authenticatorAttachment = "cross-platform";
let passkeyProvider: BrowserPasskeyProvider;

function getPasskeyProvider(rpId: string) {
    if (!passkeyProvider) {
        passkeyProvider = new BrowserPasskeyProvider(passkeySavedName, {
            rpName: passkeySavedName,
            rpId,
            authenticatorSelection: {
                authenticatorAttachment
            }
        } as BrowserPasswordProviderOptions);
    }
    return passkeyProvider;
}

let keypair: PasskeyKeypair;

function getPasskeyKeypair(rpId: string, publicKeyBytes: Uint8Array) {
    if (keypair && keypair.getPublicKey().toRawBytes().toString() === publicKeyBytes.toString())
        return keypair;
    return keypair = new PasskeyKeypair(publicKeyBytes, getPasskeyProvider(rpId));
}

export {
    getPasskeyProvider,
    getPasskeyKeypair
}