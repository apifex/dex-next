
import DexViewOnlyController from "../controllers/dexViewOnlyController"


const fetchOrdersList = async (): Promise<string[]> => {
    const dex = DexViewOnlyController.getInstance()
    const orders: string[] = await dex.getOrdersList()
  

    return orders
}

export default fetchOrdersList

