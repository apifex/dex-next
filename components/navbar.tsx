import { FC, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useWalletContext } from '../context/walletContext'
import OrderTypeMenu from './orderTypeMenu'
import MakeOrderModal from './orderModal'


const NavBar: FC = () => {
    const { isConnected, connect } = useWallet()
    const { ballance, address } = useWalletContext().accountInfo
    const [isMakeOrderOpen, setIsMakeOrderOpen] = useState<boolean>(false)
    const [orderType, setOrderType] = useState<string>('auction')

    const openMakeOrder = (orderType: string) => {
        setIsMakeOrderOpen(true)
        setOrderType(orderType)
    }

    return (
        <nav className="flex h-96 justify-between bg-cover bg-no-repeat bg-center flex-wrap p-6" style={{ backgroundImage: "url('/crypto3.jpg')" }}>
            <div className="flex flex-col mt-5 flex-shrink-0 text-white">
                <span className="font-bold p-1 mb-6 text-center rounded-xl text-red-600 border border-red-500 shadow-lg shadow-red-600 lg:ml-24 text-xl lg:text-4xl">
                    <svg className='ml-auto' xmlns="http://www.w3.org/2000/svg" fill="none" height={36} viewBox="0 4 48 18" stroke="currentColor">
                        <path strokeLinecap="inherit" strokeLinejoin="inherit" strokeWidth={0.4} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>DEX</span>
                <span className="font-semibold lg:ml-24 text-xl lg:text-3xl">Best Place</span>
                <span className="font-semibold lg:ml-24 text-xl lg:text-2xl">To Exchange</span>
                <span className="font-semibold lg:ml-24 text-2xl lg:text-4xl">NFT</span>
            </div>
            <div className=" flex justify-between flex-col w-auto">
                <div className='m-2 self-end'>
                    <button onClick={() => { connect() }} className="flex items-center text-xl px-4 py-2 leading-none border rounded shadow-md shadow-white text-white border-white hover:bg-white hover:bg-opacity-30 lg:mt-0">
                        <img src='/wallet-icon.svg' className='p-1' width={28} ></img>
                        <span>{isConnected ? "Metamask" : "Connect Wallet"}</span>
                    </button>
                    {isConnected ?
                        <div className='text-white text-sm mt-3 flex flex-col'>
                            <span>Signer address : {address.substring(0, 5)}...{address.substring(address.length - 4, address.length)}</span>
                            <span>Ballance: {ballance.substring(0, 6)} ETH</span>
                        </div> : null
                    }
                </div>
                <div className='m-2 self-end'>
                    <OrderTypeMenu openMakeOrder={openMakeOrder}></OrderTypeMenu>
                </div>

            </div>
            <MakeOrderModal isOpen={isMakeOrderOpen} setIsOpen={setIsMakeOrderOpen} orderType={orderType} />
        </nav>
    )
}

export default NavBar
