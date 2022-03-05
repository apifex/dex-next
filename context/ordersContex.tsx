import { createContext, useContext, useState } from 'react';
import { IOrdersContext, IOrder, IContextProviderProps } from '../types/types'

const OrdersContext = createContext<IOrdersContext>(
  {
    orders: [],
    setOrders: () => { }
  }
)

const useOrdersContext = () => {
  const context = useContext(OrdersContext)
  return context
}

const OrdersContextProvider = ({ children }: IContextProviderProps) => {
  const [orders, setOrders] = useState<IOrder[]>([])

  const value = {
    orders,
    setOrders
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export { useOrdersContext, OrdersContextProvider }


