import { ethers, utils } from "ethers";

export const dexActions = (dexContract: ethers.Contract) => {

    async function makeAuctionOrder(NFT: string, tokenid: string, startPrice: string, duration: string) {
        return await dexContract.makeAuctionOrder(NFT, tokenid, utils.parseUnits(startPrice), duration)
    }

    async function makeFixedPriceOrder(NFT: string, tokenid: string, fixedPrice: string, duration: string) {
        return await dexContract.makeFixedPriceOrder(NFT, tokenid, utils.parseUnits(fixedPrice), duration)
    }

    async function makeMixedOrder(NFT: string, tokenid: string, startPrice: string, fixedPrice: string, duration: string) {
        return await dexContract.makeMixedOrder(NFT, tokenid, utils.parseUnits(startPrice), utils.parseUnits(fixedPrice), duration)
    }

    async function bid(order: string, value: string) {
        return await dexContract.bid(order, { value: utils.parseUnits(value) })
    }

    async function buyItNow(order: string, value: string) {
        return await dexContract.buyItNow(order, { value: utils.parseUnits(value) });
    }

    async function claim(order: string) {
        return await dexContract.claim(order);
    }

    async function cancelOrder(order: string) {
        return await dexContract.cancelOrder(order);
    }

    return { makeAuctionOrder, makeFixedPriceOrder, makeMixedOrder, bid, buyItNow, claim, cancelOrder }
}