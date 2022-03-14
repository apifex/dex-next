import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ethers, utils } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'

interface IAccountStatus {

    address: string,
    ballance: string
}

class WalletController {
    private static instance: WalletController
    signer: JsonRpcSigner | null = null
    accountStatus: IAccountStatus = {address: '', ballance: ''}
    
    private constructor() {
        this.initialize()
    }

    public static getInstance (): WalletController {
        if (!WalletController.instance) {
            WalletController.instance = new WalletController()
        }
        return WalletController.instance
    }


    async initialize() {
       await this.isConnectedToMetamask()
       if (this.signer) await this.checkAccountStatus()
    }

    getSigner = () => {
        return this.signer
    }

    getAccountStatus = () => {
        return this.accountStatus
    }

    connectToMetamask = async (): Promise<boolean> => {
        try {
            const metamask = await detectEthereumProvider() as any
    
            const provider: Web3Provider = new ethers.providers.Web3Provider(metamask)
    
            if (!provider) throw new Error('No valid provider availble')
    
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()
            this.signer = signer
            await this.checkAccountStatus()
            return true
        } catch (error) {
            console.log('Error on connection to Metamask', error)
            return false
        }
    }
    
    isConnectedToMetamask = async (): Promise<boolean> => {
        try {
            const metamask = await detectEthereumProvider() as any
            
            const provider: Web3Provider = new ethers.providers.Web3Provider(metamask)
           
            if (!provider) throw new Error('no connection to metamask')
            const signer: JsonRpcSigner = provider.getSigner()
            await signer.getAddress()
            this.signer = signer
            await this.checkAccountStatus()
            return true
        } catch (error) {
            //@ts-ignore
            console.log('No connection to metamask', error.message)
            return false
        }
    }
    
    checkAccountStatus = async (): Promise<{address:string, ballance: string} | null> => {
        try {
            if (!this.signer) throw Error('no signer')
            const address = await this.signer.getAddress()
            const ballance = utils.formatEther(await this.signer.getBalance())
            this.accountStatus = {address, ballance}
            return {address, ballance}
        } catch (error) {
            return null
        }
    }
}

export default WalletController