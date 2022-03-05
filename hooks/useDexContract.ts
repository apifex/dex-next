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
    const { setOrders } = useOrdersContext()

    useEffect(() => {
        signer ? setDexContract(dexContract.connect(signer)) : null
    }
        , [signer])

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            if (!dexContract) throw new Error('no dex contract')

            const ordersList = await dexViewActions(dexContract).getOrdersList()
            const orders = []

            for (const order of ordersList) {
                const orderInfo = await fetchOrderInfo(order)
                if (orderInfo instanceof Error) throw orderInfo
                orders.push(orderInfo)
            }
            setOrders(orders)
        } catch (error) {
            console.log('error when fetching orders', error)
        }
    }

    async function fetchOrderInfo(orderId: string): Promise<IOrder | Error> {
        try {
            const orderInfo = await dexViewActions(dexContract).getOrderInfo(orderId)
            const orderStatus = await dexViewActions(dexContract).getOrderStatus(orderId)
            const { tokenMetadataURI, seller, startPrice, fixedPrice, actualPrice, lastBidder, endTime } = orderInfo
            const response = await fetch(tokenMetadataURI)
            const tokenMetadata: INftMetadata = await response.json()
            const { properties } = tokenMetadata

            return {
                orderId: orderId,
                status: orderStatus,
                sellerAddress: String(seller),
                lastBidderAddress: String(lastBidder),
                tokenName: properties.name,
                description: properties.description,
                tokenImageUri: properties.image,
                startPrice: utils.formatEther(startPrice),
                actualPrice: utils.formatEther(actualPrice),
                fixedPrice: utils.formatEther(fixedPrice),
                endTime: new Date(Number(endTime) * 1000).toLocaleString()
            }
        } catch (error) {
            return new Error('error when fetching Order info')
        }
    }

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
                await fetchOrders()
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

    return { makeOrder, bid, buyItNow, claim, cancelOrder, fetchOrders }
}