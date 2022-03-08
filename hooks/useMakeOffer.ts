import { useState, ChangeEventHandler } from 'react'
import { useWalletContext } from '../context/walletContext'
import { useDexContract } from '../hooks/useDexContract'
import { IOrder, IMessage, MetaMaskError } from '../types/types'



export const useMakeOffer = (orderInfo: { order: IOrder, offerType: string }) => {
    const { isConnected } = useWalletContext()

    const { bid, buyItNow } = useDexContract()

    const { order, offerType } = orderInfo

    const [message, setMessage] = useState<IMessage>({ error: null, success: null })

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [offerValue, setOfferValue] = useState(order.fixedPrice)


    const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        setOfferValue(event.target.value)
    }


    async function confirmOffer() {
        setIsProcessing(true)
        const fn = (offerType == 'bid') ? bid : buyItNow
        try {
            if(!isConnected) throw Error('Connect a wallet befor doing transaction.')
            const tx = await fn(order.orderId, offerValue)
            const txResponse = await tx.wait()
            if (txResponse.status == 1) {
                setIsProcessing(false)
                setMessage({ error: null, success: 'Success' })
            } else { throw Error('transaction failed') }
        } catch (error) {
            setIsProcessing(false)
            let err = error as MetaMaskError
            if (err.error) {
                if (err.error.message) {
                    setMessage({ error: err.error.message, success: null })
                }
            } else {
                setMessage({ error: err.message, success: null })
            }
        }
    }

    return { confirmOffer, inputHandler, isProcessing, message }
}

