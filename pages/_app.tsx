import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { OrdersContextProvider } from '../context/ordersContex'
import { WalletContextProvider } from '../context/walletContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <OrdersContextProvider>
        <Component {...pageProps} />
      </OrdersContextProvider>
    </WalletContextProvider>
  )
}

export default MyApp
