import NftController from '../controllers/nftController'
import {ITokenInfo, INftMetadata} from '../types/types'

async function fetchTokenInfo(nft: NftController, tokenId: string): Promise<ITokenInfo | Error>{
    try {
        if (!nft) throw Error ('no connection to contract')
        const tokenInfoURI = await nft.getTokenURI(tokenId)
        const tokenData = await fetch(tokenInfoURI)
        const tokenMetadata: INftMetadata = await tokenData.json()
        const { properties } = tokenMetadata
        const tokenInfo = {
            tokenName: properties.name,
            description: properties.description,
            tokenImageUri: properties.image
        }
        return tokenInfo
    } catch (error) {
       console.log('error on fetch token info', error)
       return Error('error on fetch token info')
    }
}

export default fetchTokenInfo