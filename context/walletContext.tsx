import { JsonRpcSigner } from "@ethersproject/providers";
import { createContext, useContext, useState } from 'react';
import { IWalletContext, IContextProviderProps, IAccountInfo } from '../types/types'

const WalletContext = createContext<IWalletContext>(
  {
    isConnected: false,
    signer: null,
    accountInfo: { address: '', ballance: '' },
    updateAccountInfo: () => { },
    clearAccountInfo: () => { },
    updateSigner: () => { }
  }
)

const useWalletContext = () => {
  const context = useContext(WalletContext)
  return context
}

const WalletContextProvider = ({ children }: IContextProviderProps) => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [accountInfo, setAccountInfo] = useState<IAccountInfo>({
    address: "",
    ballance: ""
  })

  const updateAccountInfo = (accountInfo: IAccountInfo) => {
    setAccountInfo(accountInfo)
  }

  const clearAccountInfo = () => {
    setAccountInfo({ address: '', ballance: '' })
    setIsConnected(false)
  }
  const updateSigner = (newSigner: JsonRpcSigner) => {
    setSigner(newSigner)
    setIsConnected(true)
  }

  const value = {
    isConnected,
    signer,
    accountInfo,
    updateAccountInfo,
    clearAccountInfo,
    updateSigner
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )

}

export { useWalletContext, WalletContextProvider }


