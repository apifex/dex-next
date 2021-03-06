import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useMakeOrder } from '../controllerComponents/useMakeOrder'
import { IOrderModalProps } from '../../types/types'
import OrderPreview from './orderPreview'


export default function MakeOrder({ setIsOpen, orderType }: IOrderModalProps) {
  const { inputHandler, isValidInput, inputValues, inputErrors, confirm, closeModal, processing, orderPreview, errorMessage } = useMakeOrder({ setIsOpen, orderType })
  
  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => { }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-900"
                >
                  {`Make ${orderType} Order`}
                </Dialog.Title>
                <div className='flex flex-row'>
                  <div className="basis-2/4 m-1">
                    <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='nftAddress' value={inputValues.nftAddress} onChange={inputHandler} onBlur={isValidInput} placeholder='NFT Contract Address' />
                    {inputErrors.nftAddress != '' ? <span className=' text-red-500 font-light italic'>{inputErrors.nftAddress}</span> : null}
                    <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='tokenId' value={inputValues.tokenId} onChange={inputHandler} onBlur={isValidInput} placeholder='NFT Token ID' />
                    {inputErrors.tokenId != '' ? <span className=' text-red-500 font-light italic'>{inputErrors.tokenId}</span> : null}
                    {orderType != 'fixed' ? <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='startPrice' value={inputValues.startPrice} onChange={inputHandler} onBlur={isValidInput} placeholder='Start Price' /> : null}
                    {inputErrors.startPrice != '' ? <span className=' text-red-500 font-light italic'>{inputErrors.startPrice}</span> : null}
                    {orderType != 'auction' ? <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='buyItNowPrice' value={inputValues.buyItNowPrice} onChange={inputHandler} onBlur={isValidInput} placeholder='Buy it Now Price' /> : null}
                    {inputErrors.buyItNowPrice != '' ? <span className=' text-red-500 font-light italic'>{inputErrors.buyItNowPrice}</span> : null}
                    <p className=" text-gray-500">
                      End Time:
                    </p>
                    <div className='inline-block'>
                      <input type='date' className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='endDate' onChange={inputHandler} />
                      <input type="time" className='m-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='endTime' onChange={inputHandler} onBlur={isValidInput} />
                      {inputErrors.endTime != '' ? <span className=' text-red-500 font-light italic'>{inputErrors.endTime}</span> : null}
                    </div>
                  </div>

                  <div className="basis-2/4 m-1">
                    <p className='mt-12 text-red-600 text-base'>{errorMessage}</p>
                    {
                      orderPreview ?
                        <OrderPreview tokenName={orderPreview.tokenName} description={orderPreview.description} tokenImageUri={orderPreview.tokenImageUri} /> : null
                    }

                  </div>

                </div>
                {processing.isProcessing ?
                  <div className='flex'>
                    <svg role="status" className="mr-2 w-6 h-6 text-red-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                    </svg>
                    {processing.message}
                  </div>
                  :
                  <div className='text-center'>
                    {processing.message == '' ? <button
                      type="button"
                      className="m-5 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={confirm}
                    >
                      Make Order
                    </button> : processing.message}
                    <button
                      type="button"
                      className="m-5 px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={closeModal}
                    >
                      {processing.message == 'success' ? 'Close' : 'Cancel'}
                    </button>
                  </div>
                }
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
