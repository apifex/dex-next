import { ethers } from "ethers";
import { txErrorHandler} from "../utils/errorHandler";
import DexAbi from '../abi/DEX.json'

interface IOrderInfo {
    tokenAddress: string,
    tokenId: string,
    tokenMetadataURI: string,
    seller: string,
    startPrice: string,
    fixedPrice: string,
    actualPrice: string,
    lastBidder: string,
    endTime: string
}

class DexViewOnlyController {
    static instance: DexViewOnlyController
    contract: ethers.Contract

    private constructor() {
        this.contract = new ethers.Contract(process.env.NEXT_PUBLIC_DEXADDRESS as string, DexAbi.abi, ethers.getDefaultProvider('rinkeby'))
    }

    public static getInstance(): DexViewOnlyController {
        if (!DexViewOnlyController.instance) {
            DexViewOnlyController.instance = new DexViewOnlyController()
        }
        return DexViewOnlyController.instance
    }

    @txErrorHandler()
    async getOrdersList(): Promise<string[]> {
        return await this.contract.getOrdersList()
    }

    @txErrorHandler()
    async getOrderInfo(order: string): Promise<IOrderInfo> {
        return await this.contract.getOrderInfo(order)
    }

    @txErrorHandler()
    async getCurrentPrice(order: string): Promise<BigInt> {
        return await this.contract.getCurrentPrice(order);
    }

    @txErrorHandler()
    async getOrderStatus(order: string): Promise<string> {
        return await this.contract.getOrderStatus(order)
    }
}

export default DexViewOnlyController