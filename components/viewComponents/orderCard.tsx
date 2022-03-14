import { FC } from 'react'
import { ICardProps } from "../../types/types";
import useOrderCard from '../controllerComponents/useOrderCard';
import MakeOffer from './offerModal';



const OrderCard: FC<ICardProps> = ({ orderId, filters }) => {

    const { display, orderInfo, offerModal, closeOfferModal, processing, isSeller, isBuyer, buttonHandler } = useOrderCard(orderId, filters)

    const { status, sellerAddress, tokenName, description, tokenImageUri, startPrice, fixedPrice, actualPrice, endTime } = orderInfo

    return (
        display ?
            <>
                <div className='max-w-sm w-80 text-center rounded overflow-hidden m-4 shadow-lg divide-y'>
                    <div className='m-2 p-0'>
                        <span className='text-sm text-gray-600 mr-2'>Status: <span className='font-semibold uppercase'>{status}</span></span>
                        {isSeller && status == 'active' ?
                            processing.isProcessing ?
                                <span className='text-sm text-red-700 mr-2'>{processing.message}</span> :
                                <button id="cancel" onClick={buttonHandler}
                                    className='w-32 bg-red-500 hover:bg-red-700 text-white font-bold  rounded-full'>
                                    Cancel</button> : null}
                        <p className='text-sm text-gray-700 m-2'>EndTime: <span className='font-semibold'>{endTime}</span></p>
                    </div>
                    <div>
                        <h3 className='py-2 font-bold text-xl text-center mb-0'>{tokenName}</h3>
                        {tokenImageUri != '' ? <img className='m-auto px-2' src={tokenImageUri} alt='crypto1' ></img> :
                            <svg role="status" className="m-auto w-6 h-6 text-red-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                            </svg>}
                        <p className='text-gray-700 px-2 py-2 text-base'>{description}</p>
                    </div>
                    <div className='flex flex-col px-6 py-4'>
                        <p className='text-xs text-gray-700 mb-2'>Initial Price: <span className='font-semibold'>{startPrice != '0.0' ?
                            startPrice : fixedPrice}ETH</span> </p>
                        <span className='text-gray-700 mr-2 mb-0'>Actual price: <span className='font-semibold'>{actualPrice} ETH</span> </span>

                    </div>
                    <div>
                        {(isSeller || isBuyer) && status == 'over' ?
                            processing.isProcessing ?
                                <span className='text-sm text-green-600 mr-2'>{processing.message}</span> :
                                <button id="claim" onClick={buttonHandler} className='w-40 bg-green-500 hover:bg-green-700 text-white font-bold mx-4 my-2 py-2 px-4 rounded-full'>CLAIM</button>
                            : null}
                        {startPrice != '0.0' && status == 'active' ?
                            <button id="bid" onClick={buttonHandler} className='w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 my-2 py-2 rounded-xl'>BID</button>
                            : null}
                        {fixedPrice != '0.0' && status == 'active' ?
                            <button id="buyItNow" onClick={buttonHandler} className='w-34 bg-blue-500 hover:bg-blue-700 text-white font-semibold mx-2 my-2 py-2 px-2  rounded-xl'>BUY NOW {fixedPrice} ETH</button>
                            : null}
                    </div>
                    <div>
                        <p className='text-xs italic text-gray-700 m-2'>Seller address: <span className='font-semibold'>{sellerAddress.substring(0, 5)}...{sellerAddress.substring(sellerAddress.length - 4, sellerAddress.length)}</span></p>
                    </div>


                    {offerModal ?
                        <MakeOffer
                            closeModal={closeOfferModal}
                            offerType={offerModal.offerType}
                            orderInfo={offerModal.orderInfo} />
                        : null}

                </div>
            </>
            : null
    )
}

export default OrderCard
