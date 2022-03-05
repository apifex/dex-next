import { JsonRpcSigner } from "@ethersproject/providers";
import { createContext, useContext, useState } from 'react';
import { IWalletContext, IContextProviderProps, IAccountInfo } from '../types/types'

const WalletContext = createContext<IWalletContext>(
  {
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
  const [accountInfo, setAccountInfo] = useState<IAccountInfo>({
    address: "",
    ballance: ""
  })

  const updateAccountInfo = (accountInfo: IAccountInfo) => {
    setAccountInfo(accountInfo)
  }

  const clearAccountInfo = () => {
    setAccountInfo({ address: '', ballance: '' })
  }
  const updateSigner = (newSigner: JsonRpcSigner) => {
    setSigner(newSigner)
  }

  const value = {
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


