import { ethers, utils } from "ethers";
import { txErrorHandler } from "../utils/errorHandler";
import DexAbi from '../abi/DEX.json'
import WalletController from "./walletController";

class DexController {
    static instance: DexController

    contract: ethers.Contract | null = null

    private constructor() {
        this.init()
    }

    public static getInstance(): DexController {
        if (!DexController.instance) {
            DexController.instance = new DexController()
        }
        return DexController.instance
    }

    async init() {
        const signer = WalletController.getInstance().getSigner()
        if (signer) {
            this.contract = new ethers.Contract(process.env.NEXT_PUBLIC_DEXADDRESS as string, DexAbi.abi, signer)
        }
    }

    @txErrorHandler()
    async contractTransaction (fn: any, args: any[]) {
        const tx = await fn(...args)
        const txResponse = await tx.wait()
        if (txResponse.status != 1) throw Error ('Contract error')
        return 'success'
    }

    makeAuctionOrder = async (NFT: string, tokenid: string, startPrice: string, duration: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.makeAuctionOrder, [NFT, tokenid, utils.parseUnits(startPrice), duration])
    }

    makeFixedPriceOrder = async (NFT: string, tokenid: string, fixedPrice: string, duration: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.makeFixedPriceOrder, [NFT, tokenid, utils.parseUnits(fixedPrice), duration])
    }

    makeMixedOrder = async (NFT: string, tokenid: string, startPrice: string, fixedPrice: string, duration: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.makeMixedOrder, [NFT, tokenid, utils.parseUnits(startPrice), utils.parseUnits(fixedPrice), duration])
    }

    bid = async (order: string, value: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.bid, [order, { value: utils.parseUnits(value) }])
    }

    buyItNow = async (order: string, value: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.buyItNow, [order, { value: utils.parseUnits(value)}])
    }
    
    claim = async (order: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.claim, [order])
    }

    cancelOrder = async (order: string): Promise<string> => {
        if (!this.contract) return 'no wallet connection'
        return await this.contractTransaction(this.contract.cancelOrder, [order])
    }
}

export default DexController