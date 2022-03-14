import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useMakeOffer } from '../controllerComponents/useMakeOffer'
import { IOfferProps } from '../../types/types'

export default function MakeOffer({closeModal, offerType, orderInfo }: IOfferProps) {
  
  const { orderId, actualPrice, fixedPrice, tokenName, tokenImageUri, description } = orderInfo
  const { confirmOffer, inputHandler, isProcessing, message } = useMakeOffer({orderId, offerType, fixedPrice})

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
                  Make Offer
                </Dialog.Title>
                <div className='flex pt-8 flex-row'>
                  <div className="basis-2/4 m-1">
                    {message.success ? <p className='mt-12 text-green-600 text-base'>{message.success}</p> : null}
                    {message.error ? <p className='mt-12 text-red-600 text-base'>{message.error}</p> : null}
                    {offerType == 'buyItNow' ?
                      <div>
                        <p className='text-gray-700 font-semibold pt-6 mb-6 text-base'>Buy it Now Price: {fixedPrice} ETH</p>
                        <label className='pl-2 text-blue-300 italic'>Your offer: </label>
                        <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='offerValue' value={fixedPrice} onLoad={inputHandler} disabled />
                      </div> :
                      <div>
                        <p className='text-gray-700 font-semibold pt-6 mb-6 text-base'>Actual Price: {actualPrice} ETH</p>
                        <label className='pl-2 text-blue-300 italic'>Your offer: </label>
                        <input className='my-2 p-2 border-2 rounded-md bg-slate-200 disabled:opacity-75' id='offerValue' onChange={inputHandler} placeholder='Your offer in ETH' />
                      </div>
                    }
                  </div>

                  <div className="basis-2/4 m-1">
                    <div className='max-w-sm text-center rounded overflow-hidden m-4 shadow-lg'>
                      <h3 className='p-4 font-bold text-xl text-center m-2'>{tokenName}</h3>
                      <img className='px-4 pl-6' src={tokenImageUri} alt='crypto1' ></img>
                      <div className='px-6 py-4'>
                        <p className='text-gray-700 text-base'>{description}</p>
                      </div>
                    </div>
                  </div>

                </div>
                {isProcessing ?
                  <div className='text-center flex'>
                    <svg role="status" className="mr-2 w-6 h-6 text-red-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                    </svg>
                    Processing...
                  </div>
                  :
                  message.success ?
                    <div className='text-center'>
                      <button
                        type="button"
                        className="m-5 px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div> :
                    <div className='text-center'>
                      <button
                        type="button"
                        className="m-5 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={confirmOffer}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="m-5 px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={closeModal}
                      >
                        Cancel
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
