import { useState, ChangeEventHandler } from 'react'
import DexController from '../../controllers/dexTransactionsController'

export const useMakeOffer = (order: { orderId: string, offerType: string, fixedPrice: string}) => {

    const { bid, buyItNow } = DexController.getInstance()

    const { orderId, offerType, fixedPrice} = order
    const [message, setMessage] = useState<{error: string | null, success: string | null}>({ error: null, success: null })
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [offerValue, setOfferValue] = useState('')

    const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        setOfferValue(event.target.value)
    }

    async function confirmOffer() {
        setIsProcessing(true)
        let response: string = ''
        if (offerType == 'bid') {
            response = await bid(orderId, offerValue)
        } else if (offerType == 'buyItNow') {
            response = await buyItNow(orderId, fixedPrice)
        }
        setIsProcessing(false)
        setMessage({error: response == 'success'?'':response, success: response == 'success'?response:''})
    }

    return { confirmOffer, inputHandler, isProcessing, message }
}

