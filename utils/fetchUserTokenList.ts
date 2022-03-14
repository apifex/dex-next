
interface IUserToken {
    contractAddress: string,
    tokenId: string
}
interface IUserTokenResponseInfo {
        blockNumber: number,
        timeStamp: number,
        hash:string,
        nonce:number,
        blockHash:string,
        from:string,
        contractAddress:string,
        to:string,
        tokenID:string,
        tokenName:string,
        tokenSymbol:string,
        tokenDecimal:number,
        transactionIndex:string,
        gas:number,
        gasPrice:number,
        gasUsed:number,
        cumulativeGasUsed:number,
        input:string,
        confirmations: number
}

interface IUserTokenResponse {
    status: number,
    message: string,
    result: IUserTokenResponseInfo[] 
}
const fetchUserTokenList = async (address: string): Promise<IUserToken[]>=> {
    const response = await fetch(`https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=${address}&page=1&offset=999&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN}`)
    const tokensTx: IUserTokenResponse = await response.json()
   
    const onHandTokens = tokensTx.result.reduce((onHand, tx, index, allTx)  => {
            if (tx.to == address) {
                const txOut = allTx.slice(index).find(elx => { return elx.contractAddress == tx.contractAddress && elx.tokenID == tx.tokenID && elx.from == address})
                if (!txOut) onHand.push({contractAddress: tx.contractAddress, tokenId: tx.tokenID})
            }
            return onHand
        }, <IUserToken[]>[])
    return onHandTokens
    
}

export default fetchUserTokenList

