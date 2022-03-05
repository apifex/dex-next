import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ethers, utils } from "ethers";


export const connectToMetamask = async (): Promise<JsonRpcSigner | null> => {
    try {
        if (!(window as any).ethereum && (window as any).ethereum.isMetaMask) throw new Error('no metamask installed')

        const provider: Web3Provider = new ethers.providers.Web3Provider((window as any).ethereum)

        if (!provider) throw new Error('No valid provider availble')

        await provider.send("eth_requestAccounts", []);
        const signer: JsonRpcSigner = provider.getSigner()
        return signer
    } catch (error) {
        console.log('connection to metamask error', error)
        return null
    }
}

export const isConnectedToMetamask = async (): Promise<JsonRpcSigner | null> => {
    try {
        const provider: Web3Provider = new ethers.providers.Web3Provider((window as any).ethereum)
        if (!provider) throw new Error('no connection to metamask')
        const signer: JsonRpcSigner = provider.getSigner()
        await signer.getAddress()
        return signer
    } catch (error) {
        console.log('no connection to metamask')
        return null
    }
}

export const checkBallance = async (signer: JsonRpcSigner): Promise<string> => {
    try {
        const ballance = utils.formatEther(await signer.getBalance())
        return ballance.toString();
    } catch (error) {
        console.log("error on check ballance", error)
        return 'Error on check ballance'
    }

}