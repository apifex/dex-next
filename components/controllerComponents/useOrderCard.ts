import { useEffect, useState, MouseEventHandler } from "react"
import { IFilters, IOrder } from "../../types/types"
import DexController from '../../controllers/dexTransactionsController'
import { useWalletContext } from "../../context/walletContext"
import fetchOrderInfo from "../../utils/fetchOrderInfo"

const useOrderCard = (orderId: string, filters: IFilters) => {
    
    const [display, setDisplay] = useState(true)
    const {accountInfo} = useWalletContext()
    const [offerModal, setOfferModal] = useState<{ offerType: string, orderInfo: IOrder } | null>(null)
    const [processing, setProcessing] = useState<{ isProcessing: boolean, message: string }>({ isProcessing: false, message: '' })
    const [isBuyer, setIsBuyer] = useState<boolean>(false)
    const [isSeller, setIsSeller] = useState<boolean>(false)
    const [orderInfo, setOrderInfo] = useState<IOrder>({
        orderId: orderId,
        status: 'unknown',
        sellerAddress: '0x0000000000000000000000000000000000000000',
        lastBidderAddress: '',
        tokenName: 'Loading...',
        description: '',
        tokenImageUri: '',
        startPrice: '',
        actualPrice: '',
        fixedPrice: '',
        endTime: ''})
    
    useEffect(()=>{
        async function fetchInfo () {
            const info = await fetchOrderInfo(orderId)
            if (info instanceof Error) return
            setOrderInfo(info)
        }
        fetchInfo()
    },[orderId])

    useEffect(()=>{
        setDisplay(true)
        if (filters.active && orderInfo.status != 'active' && orderInfo.status != 'unknown') setDisplay(false)
        if (filters.auction && orderInfo.startPrice == '0.0') setDisplay(false)
        if (filters.buyItNow && orderInfo.fixedPrice == '0.0') setDisplay(false)
        if (filters.your && orderInfo.sellerAddress != accountInfo.address) setDisplay(false)
    }, [filters, orderInfo])
   
    useEffect(()=>{
        checkRoles()
    }, [accountInfo, orderInfo])

    const buttonHandler: MouseEventHandler<HTMLButtonElement> = async (event) => {
        const dexTx = DexController.getInstance('use order')
        
        const buttonId = event.currentTarget.id
        
        switch (buttonId) {
            case ('bid'):
                setOfferModal({ offerType: 'bid', orderInfo})
                break;
            case ('buyItNow'):
                setOfferModal({ offerType: 'buyItNow', orderInfo})
                break;
            case ('claim'):
                setProcessing({ isProcessing: true, message: '...processing' })
                const responseClaim = await dexTx.claim(orderInfo.orderId)
                setProcessing({ isProcessing: true, message: responseClaim })
                break;
            case ('cancel'):
                setProcessing({ isProcessing: true, message: '...processing' })
                const responseCancel = await dexTx.cancelOrder(orderInfo.orderId)
                setProcessing({ isProcessing: true, message: responseCancel })
                break;
        }
    }

    const closeOfferModal = () => {
        setOfferModal(null)
    }

    const checkRoles = () => {
        setIsSeller(accountInfo.address == orderInfo.sellerAddress)
        setIsBuyer(accountInfo.address == orderInfo.lastBidderAddress)
    }

    return { display, orderInfo, offerModal, closeOfferModal, processing, isSeller, isBuyer, buttonHandler }
}

export default useOrderCard

