import { useEffect, useState } from 'react'
import { useWalletContext } from '../../context/walletContext'
import WalletController from '../../controllers/walletController'
import { IUserToken } from '../../types/types'
import fetchUserTokenList from '../../utils/fetchUserTokenList'


export const useNavBar = () => {
    const wallet = WalletController.getInstance()
    const {accountInfo, updateAccountInfo} = useWalletContext()

    const [userTokens, setUserTokens] = useState<IUserToken[]>([])

    useEffect(()=>{
        let account = {address:'', ballance: ''}
        const interval = setInterval(()=>{
            if (!wallet.checkAccountStatus()) return
            if (wallet.accountStatus.address != account.address) {
                updateAccountInfo(wallet.accountStatus)
                account = wallet.accountStatus
                loadUserTokens()
            }
        }, 1000)
        return ()=> clearInterval(interval)
    }, [])

    const loadUserTokens = async () => {
        const userTokenList = await fetchUserTokenList(wallet.accountStatus.address.toLowerCase())
        setUserTokens(userTokenList)
    }

    const connectHandler = async () => {
        await wallet.connectToMetamask()
        updateAccountInfo(wallet.accountStatus)
    }
    const [isMakeOrderOpen, setIsMakeOrderOpen] = useState<boolean>(false)
    const [orderType, setOrderType] = useState<string>('auction')

    const openMakeOrder = (orderType: string) => {
        setIsMakeOrderOpen(true)
        setOrderType(orderType)
    }

    return {accountInfo, isMakeOrderOpen, setIsMakeOrderOpen, orderType, openMakeOrder, connectHandler, userTokens}
} 
