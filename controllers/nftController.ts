import { ethers } from "ethers";

import NFTAbi from '../abi/NFT.json'
import WalletController from "./walletController";


interface MetamaskError extends Error {
    error?: {
        message: string
    }
}
//TODo check if contract implements ERC 721
class NftController {
    private static instance: NftController
    private static nftContract: string
    contractWithDefaultProvider: ethers.Contract
    contract: ethers.Contract | null = null

    private constructor(nftContractAddress: string) {
        this.initialize()
        const defaultProvider = ethers.getDefaultProvider('rinkeby')
        this.contractWithDefaultProvider = new ethers.Contract(nftContractAddress, NFTAbi.abi, defaultProvider)
    }

    public static getInstance(nftContractAddress: string): NftController {
        if (!NftController.instance || nftContractAddress != NftController.nftContract) {
            NftController.instance = new NftController(nftContractAddress)
        }
        return NftController.instance
    }

    async initialize() {
        const signer = WalletController.getInstance().getSigner()
        if (signer) {
            this.contract = new ethers.Contract(NFTAbi.contractAddress, NFTAbi.abi, signer)
        }
    }

    approve = async (contractAddress: string, tokenId: string): Promise<string> => {
        try {
            if (!this.contract) throw Error('connection to contract not found')
            const tx = await this.contract.approve(contractAddress, tokenId)
            const txResponse = await tx.wait()
            if (txResponse.status != 1) throw Error('unknown error on interaction with NFT contract')
            return 'success'
        } catch (error) {
            let err = error as MetamaskError
                if (err && err.message) {
                    if (err.error) return err.error.message
                    return err.message
                } else return 'unknown error'
        }
    }

    getTokenURI = async (tokenId: string): Promise<string> => {
        if (!this.contract) return 'nft contract not found'
        return await this.contract.getTokenURI(tokenId)
    }

    ownerOf = async (tokenId: string): Promise<string> => {
        if (!this.contract) return 'nft contract not found'
        return await this.contract.ownerOf(tokenId)
    }

    getApproved = async (tokenId: string): Promise<string> => {
        if (!this.contract) return 'nft contract not found'
        return await this.contract.getApproved(tokenId)
    }

   isApprovedForAll = async (owner: string, operator: string) => {
        if (!this.contract) return 'nft contract not found'
        return await this.contract.isApprovedForAll(owner, operator)
    }

}

export default NftController