import { JsonRpcSigner } from "@ethersproject/providers";

import { useState, useEffect } from "react";
import { connectToMetamask, checkBallance, isConnectedToMetamask } from "../lib/metamask";
import { useWalletContext } from "../context/walletContext";

export const useWallet = () => {
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    const updateWaletContext = useWalletContext().updateAccountInfo
    const updateSigner = useWalletContext().updateSigner

    useEffect(() => {
        async function updateWallet() {
            const isConnected = await isConnectedToMetamask()
            if (isConnected) {
                setSigner(isConnected)
                setIsConnected(true)
                updateContext(isConnected)
                updateSigner(isConnected)
            }
        }
        updateWallet()
    }, [])

    async function updateContext(signer: JsonRpcSigner) {
        const address = await signer.getAddress()
        const ballance = await checkBallance(signer)
        updateWaletContext({ address, ballance })
    }

    async function connect() {
        try {
            const signer = await connectToMetamask()
            if (!signer) throw new Error('connection failed')
            setSigner(signer)
            setIsConnected(true)
            updateContext(signer)
            updateSigner(signer)
        } catch (error) {
            console.log('Error when connecting to metamask', error)
        }

    }

    return { isConnected, signer, connect }
}
