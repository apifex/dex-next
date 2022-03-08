import { ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import DexAbi from '../abi/DEX.json'
import NFTAbi from '../abi/NFT.json'
import { IOrder, INftMetadata } from "../types/types";
import { useWalletContext } from "../context/walletContext";
import { useOrdersContext } from "../context/ordersContex";
import { dexViewActions } from "../lib/dexViewActions";
import { dexActions } from "../lib/dexActions";

export const useDexContract = () => {
    const defaultProvider = ethers.getDefaultProvider('rinkeby')
    const dexContractWithDefaultProvider = new ethers.Contract(DexAbi.contractAddress, DexAbi.abi, defaultProvider)
    const [dexContract, setDexContract] = useState<ethers.Contract>(dexContractWithDefaultProvider)

    const { signer } = useWalletContext()
    const { updateOrders } = useOrdersContext()

    useEffect(() => {
        signer ? setDexContract(dexContract.connect(signer)) : null
    }
        , [signer])

    async function makeOrder(NFTAddress: string, NFTId: string, price: string, duration: string, orderType: string, fixedPrice?: string,): Promise<string> {
        if (!dexContract) return 'no valid dex contract'
        try {
            if (!signer) return 'no signer'
            const nftcontract = new ethers.Contract(NFTAddress, NFTAbi.abi, signer)
            const tx = await nftcontract.approve(DexAbi.contractAddress, NFTId)
            await tx.wait()
            let makeOrderTx
            switch (orderType) {
                case 'auction':
                    makeOrderTx = await dexActions(dexContract).makeAuctionOrder(NFTAddress, NFTId, price, duration)
                    break
                case 'fixed':
                    makeOrderTx = await dexActions(dexContract).makeFixedPriceOrder(NFTAddress, NFTId, price, duration)
                    break
                case 'mixed':
                    if (!fixedPrice) throw new Error('no price for mixed auction')
                    makeOrderTx = await dexActions(dexContract).makeMixedOrder(NFTAddress, NFTId, price, fixedPrice, duration)
                    break
            }
            let txResponse = await makeOrderTx.wait()
            if (txResponse.status == 1) {
                await updateOrders()
                return 'success'
            } else throw new Error('error')
        } catch (error) {
            console.log('error when making order', error)
            return 'erron when making order'
        }
    }

    async function bid(orderId: string, value: string) {
        return await dexActions(dexContract).bid(orderId, value)
    }

    async function buyItNow(orderId: string, value: string) {
        return await dexActions(dexContract).buyItNow(orderId, value)
    }

    async function claim(orderId: string) {
        try {
            const tx = await dexActions(dexContract).claim(orderId)
            const txResponse = await tx.wait()
            if (txResponse.status == 1) {
                return 'sucess'
            } else throw new Error('error on claim')
        } catch (error) {
            console.log('error on claim', error)
            return 'error'
        }
    }

    async function cancelOrder(orderId: string): Promise<string> {
        try {
            const tx = await dexActions(dexContract).cancelOrder(orderId)
            const txResponse = await tx.wait()
            if (txResponse.status == 1) {
                return 'sucess'
            } else throw new Error('error on cancel')
        } catch (error) {
            console.log('error on cancel', error)
            return 'error'
        }
    }

    return { makeOrder, bid, buyItNow, claim, cancelOrder }
}