import { ethers } from "ethers";
import NFTAbi from '../abi/NFT.json'

export const nftViewActions = (contractAddress: string) => {
    const defaultProvider = ethers.getDefaultProvider('rinkeby', { etherscan: 'C5D3Q7PU675DJVJDFQFFA21W9WM46273KN' })
    const nftContract = new ethers.Contract(contractAddress, NFTAbi.abi, defaultProvider)

    async function getTokenURI(tokenId: string): Promise<string> {
        return await nftContract.getTokenURI(tokenId)
    }

    async function ownerOf(tokenId: string): Promise<string> {
        return await nftContract.ownerOf(tokenId)
    }

    async function getApproved(tokenId: string): Promise<string> {
        return await nftContract.getApproved(tokenId)
    }

    async function isApprovedForAll(owner: string, operator: string) {
        return await nftContract.isApprovedForAll(owner, operator)
    }

    return { getTokenURI, ownerOf, getApproved, isApprovedForAll }
}