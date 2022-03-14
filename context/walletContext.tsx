import { createContext, useContext, useState } from 'react';
import { IWalletContext, IContextProviderProps, IAccountInfo } from '../types/types'

const WalletContext = createContext<IWalletContext>(
  {
    accountInfo: { address: '', ballance: '' },
    updateAccountInfo: () => { },
    clearAccountInfo: () => { },
  }
)

const useWalletContext = () => {
  const context = useContext(WalletContext)
  return context
}

const WalletContextProvider = ({ children }: IContextProviderProps) => {
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

  const value = {
    accountInfo,
    updateAccountInfo,
    clearAccountInfo,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )

}

export { useWalletContext, WalletContextProvider }