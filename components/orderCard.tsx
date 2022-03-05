import type * as React from 'react'
import { MouseEventHandler, useState } from 'react'
import { useWalletContext } from '../context/walletContext';
import { ICardProps } from "../types/types";



const OrderCard: React.FC<ICardProps> = (props) => {
    const { accountInfo } = useWalletContext()
    const [isProcessingCancel, setIsProcessingCancel] = useState({ isProcessing: false, message: '' })
    const [isProcessingClaim, setIsProcessingClaim] = useState({ isProcessing: false, message: '' })
    const { tokenName,
        description,
        sellerAddress,
        lastBidderAddress,
        tokenImageUri,
        startPrice,
        actualPrice,
        fixedPrice,
        endTime,
        status,
        orderIndex,
        orderId,
        openOffer,
        claim,
        cancelOrder,
        fetchOrders
    } = props

    const buttonHandler: MouseEventHandler<HTMLButtonElement> = async (event) => {
        const button = event.currentTarget.id
        switch (button) {
            case ('bid'):
                openOffer(orderIndex, button)
                break;
            case ('buyItNow'):
                openOffer(orderIndex, button)
                break;
            case ('claim'):
                setIsProcessingClaim({ isProcessing: true, message: '...processing' })
                const responseClaim = await claim(orderId)
                setIsProcessingCancel({ isProcessing: true, message: responseClaim })
                setTimeout(() => fetchOrders(), 2000)
                break;
            case ('cancel'):
                setIsProcessingCancel({ isProcessing: true, message: '...processing' })
                const responseCancel = await cancelOrder(orderId)
                setIsProcessingCancel({ isProcessing: true, message: responseCancel })
                setTimeout(() => fetchOrders(), 2000)
                break;
        }
    }

    return (
        <div className='max-w-sm text-center rounded overflow-hidden m-4 shadow-lg divide-y'>
            <div className='m-2 p-0'>
                <span className='text-sm text-gray-600 mr-2'>Status: <span className='font-semibold uppercase'>{status}</span></span>
                {accountInfo.address == sellerAddress && status == 'active' ?
                    isProcessingCancel.isProcessing ?
                        <span className='text-sm text-red-700 mr-2'>{isProcessingCancel.message}</span> :
                        <button id="cancel" onClick={buttonHandler}
                            className='w-32 bg-red-500 hover:bg-red-700 text-white font-bold  rounded-full'>
                            Cancel</button> : null}
                <p className='text-sm text-gray-700 m-2'>EndTime: <span className='font-semibold'>{endTime}</span></p>
            </div>
            <div>
                <h3 className='py-2 font-bold text-xl text-center mb-0'>{tokenName}</h3>
                <img className='m-auto px-2' src={tokenImageUri} alt='crypto1' ></img>
                <p className='text-gray-700 px-2 py-2 text-base'>{description}</p>
            </div>
            <div className='flex flex-col px-6 py-4'>
                <p className='text-xs text-gray-700 mb-2'>Initial Price: <span className='font-semibold'>{startPrice != '0.0' ?
                    startPrice : fixedPrice}ETH</span> </p>
                <span className='text-gray-700 mr-2 mb-0'>Actual price: <span className='font-semibold'>{actualPrice} ETH</span> </span>

            </div>
            <div>
                {(accountInfo.address == sellerAddress || accountInfo.address == lastBidderAddress) && status == 'over' ?
                    isProcessingClaim.isProcessing ?
                        <span className='text-sm text-green-600 mr-2'>{isProcessingClaim.message}</span> :
                        <button id="claim" onClick={buttonHandler} className='w-40 bg-green-500 hover:bg-green-700 text-white font-bold mx-4 my-2 py-2 px-4 rounded-full'>CLAIM</button>
                    : null}
                {startPrice != '0.0' && status == 'active' ?
                    <button id="bid" onClick={buttonHandler} className='w-40 bg-blue-500 hover:bg-blue-700 text-white font-bold mx-1 my-2 py-2 rounded-full'>BID</button>
                    : null}
                {fixedPrice != '0.0' && status == 'active' ?
                    <button id="buyItNow" onClick={buttonHandler} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold mx-4 my-2 py-2 px-4 rounded-full'>BUY for {fixedPrice} ETH</button>
                    : null}
            </div>
            <div>
                <p className='text-xs italic text-gray-700 m-2'>Seller address: <span className='font-semibold'>{sellerAddress}</span></p>
            </div>

        </div>


    )
}

export default OrderCard
