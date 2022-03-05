import { ethers } from "ethers";
import NFTAbi from '../abi/NFT.json'
import DexAbi from '../abi/DEX.json'
import { JsonRpcSigner } from "@ethersproject/providers";

export const nftActions = (signer: JsonRpcSigner, contractAddress: string) => {

  const nftContract = new ethers.Contract(contractAddress, NFTAbi.abi, signer)

  async function approve(tokenId: string): Promise<string> {
    return await nftContract.approve(DexAbi.contractAddress, tokenId)
  }

  return { approve }
}