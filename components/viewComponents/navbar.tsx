import { FC } from 'react'
import { useNavBar } from '../controllerComponents/useNavBar'
import OrderTypeMenu from './orderMenu'
import MakeOrderModal from './orderModal'
import UserTokenList from './userTokenList'

const NavBar: FC = () => {

    const { accountInfo, isMakeOrderOpen, setIsMakeOrderOpen, orderType, openMakeOrder, connectHandler, userTokens } = useNavBar()

    const { address, ballance } = accountInfo

    return (
        <nav className="grid grid-cols-2 bg-cover bg-no-repeat bg-center p-6" style={{ backgroundImage: "url('/crypto3.jpg')" }}>
            <div className="flex w-80 flex-col mt-5 text-white">
                <span className="font-bold w-36 p-1 mb-6 text-center rosunded-xl text-red-600 border border-red-500 shadow-lg shadow-red-600 lg:ml-24 text-xl lg:text-4xl">
                    <svg className='ml-auto' xmlns="http://www.w3.org/2000/svg" fill="none" height={36} viewBox="0 4 48 18" stroke="currentColor">
                        <path strokeLinecap="inherit" strokeLinejoin="inherit" strokeWidth={0.4} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>DEX</span>
                <span className="font-semibold lg:ml-24 text-xl lg:text-3xl">Best Place</span>
                <span className="font-semibold lg:ml-24 text-xl lg:text-2xl">To Exchange</span>
                <span className="font-semibold lg:ml-24 text-2xl lg:text-4xl">NFT</span>
            </div>

            <div className="flex flex-col">
                <div className='m-2 self-end'>
                    <button onClick={connectHandler} className="flex items-center text-xl px-4 py-2 leading-none border rounded shadow-md shadow-white text-white border-white hover:bg-white hover:bg-opacity-30 lg:mt-0">
                        <img src='/wallet-icon.svg' className='p-1' width={28} ></img>
                        <span>{address != '' ? "Metamask" : "Connect Wallet"}</span>
                    </button>
                    {address != '' ?
                        <div className='text-white text-sm mt-3 flex flex-col'>
                            <span>Signer address : {address.substring(0, 6)}...{address.substring(address.length - 5, address.length)}</span>
                            <span>Ballance: {ballance.substring(0, 6)} ETH</span>
                        </div> : null
                    }
                </div>
            </div>
            <div className="col-span-2 flex flex-col items-end mr-8">
                <div className='m-2'>
                    {userTokens.length != 0 ? <UserTokenList tokens={userTokens} /> : null}
                </div>

                <div className='m-2'>
                    <OrderTypeMenu openMakeOrder={openMakeOrder}></OrderTypeMenu>
                </div>

            </div>
            {isMakeOrderOpen ?
                <MakeOrderModal setIsOpen={setIsMakeOrderOpen} orderType={orderType} /> : null
            }

        </nav>
    )
}

export default NavBar
