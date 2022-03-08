import { createContext, useContext, useEffect, useState } from 'react';
import { IOrdersContext, IOrder, IContextProviderProps } from '../types/types'
import { useWalletContext } from './walletContext';
import { ethers, utils } from "ethers";
import { dexViewActions } from "../lib/dexViewActions";
import DexAbi from '../abi/DEX.json'
import { INftMetadata } from '../types/types';

const OrdersContext = createContext<IOrdersContext>(
  {
    orders: [],
    updateOrders: () => { },
    setFilterType: () => { }
  }
)

const useOrdersContext = () => {
  const context = useContext(OrdersContext)
  return context
}

enum Filter {
  all,
  onlyActive,
  onlyOwner,
  onlyBuyItNow,
  onlyBid
}

enum Sort {
  oldToNew,
  newToOld,
  firstFinishToLastFinish,
  lastFinishToFirstFinish,
  priceHighToLow,
  priceLowToHigh
}


const OrdersContextProvider = ({ children }: IContextProviderProps) => {
  const { accountInfo } = useWalletContext()
  const defaultProvider = ethers.getDefaultProvider('rinkeby')
  const dexContract = new ethers.Contract(DexAbi.contractAddress, DexAbi.abi, defaultProvider)

  const [orders, setOrders] = useState<IOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([])
  const [filterType, setFilterType] = useState<Filter>(Filter.all)


  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    console.log('fetch order')
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

  const filterOrders = () => {
    let filterFn: (el: IOrder) => boolean
    switch (filterType) {
      case (Filter.all):
        filterFn = (el) => { return true }
        break;
      case (Filter.onlyActive):
        filterFn = (el) => { return el.status == 'active' }
        break;
      case (Filter.onlyOwner):
        filterFn = (el) => { return el.sellerAddress == accountInfo.address }
        break;
      case (Filter.onlyBuyItNow):
        filterFn = (el) => { return el.startPrice == '0.0' }
        break;
      case (Filter.onlyBid):
        filterFn = (el) => { return el.fixedPrice == '0.0' }
        break
    }

    const ordersToFilter = [...orders]

    setFilteredOrders(ordersToFilter.filter((el) => { return filterFn(el) }))
  }

  const sortOrders = () => {
    //TODO
  }

  useEffect(() => {
    filterOrders()
  }, [filterType, orders])


  // const filer2 = (el: IOrder) => { return el.status == 'active' }
  // const orderCards = orders.filter(el => {return filer2(el)})
  // const filer1 = (el: IOrder)=>{return el.sellerAddress == '0x87e23B5D6972519b73f3d696561591018A1c2fd7'}

  const value = {
    orders: filteredOrders,
    updateOrders: setOrders,
    setFilterType,
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export { useOrdersContext, OrdersContextProvider }


