import { ethers } from "ethers";
import { IOrderInfo } from "../types/types";

export const dexViewActions = (dexContract: ethers.Contract) => {

    async function getOrdersList(): Promise<string[]> {
        return await dexContract.getOrdersList()
    }

    async function getOrderInfo(order: string): Promise<IOrderInfo> {
        return await dexContract.getOrderInfo(order)
    }

    async function getCurrentPrice(order: string): Promise<BigInt> {
        return await dexContract.getCurrentPrice(order);
    }

    async function getOrderStatus(order: string): Promise<string> {
        return await dexContract.getOrderStatus(order)
    }

    async function sellerTotalOrder(order: string) {
        return await dexContract.sellerTotalOrder(order)
    }

    return { getOrdersList, getOrderInfo, getCurrentPrice, getOrderStatus, sellerTotalOrder }
}