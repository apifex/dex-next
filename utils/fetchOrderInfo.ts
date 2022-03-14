import { utils } from 'ethers'
import DexViewOnlyController from "../controllers/dexViewOnlyController"
import { IOrder, INftMetadata } from "../types/types"

async function fetchOrderInfo(orderId: string): Promise<IOrder | Error> {
    const dex = DexViewOnlyController.getInstance()
    try {
        const orderInfo = await dex.getOrderInfo(orderId)
        const orderStatus = await dex.getOrderStatus(orderId)
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


export default fetchOrderInfo

