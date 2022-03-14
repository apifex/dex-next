export interface IOrder {
    orderId: string,
    status: string,
    sellerAddress: string,
    lastBidderAddress: string,
    tokenName: string,
    description: string,
    tokenImageUri: string,
    startPrice: string,
    fixedPrice: string,
    actualPrice: string,
    endTime: string,
}


export interface IFilters {
    active: boolean,
    auction: boolean,
    buyItNow: boolean,
    your: boolean
}
export interface ICardProps {
    orderIndex: number,
    orderId: string,
    filters: IFilters
}

export interface IUserToken {
    contractAddress: string,
    tokenId: string
}

export interface ITokenInfo {
    tokenName: string,
    description: string,
    tokenImageUri: string
}

export interface IOrderInfo {
    tokenAddress: string,
    tokenId: string,
    tokenMetadataURI: string,
    seller: string,
    startPrice: string,
    fixedPrice: string,
    actualPrice: string,
    lastBidder: string,
    endTime: string
}

export interface INftMetadata {
    title: string,
    properties: {
        name: string,
        description: string,
        image: string
    }
}

export interface IContextProviderProps {
    children: ReactNode;
}

export interface IAccountInfo {
    address: string,
    ballance: string,
}

export interface IWalletContext {
    accountInfo: IAccountInfo,
    updateAccountInfo: (accountInfo: IAccountInfo) => void,
    clearAccountInfo: () => void,
}

enum Filter {
    all,
    onlyActive,
    onlyOwner,
    onlyBuyItNow,
    onlyBid
}

export interface IOrdersContext {
    orders: IOrder[],
    updateOrders: Dispatch<SetStateAction<IOrder[]>>,
    setFilterType: Dispatch<SetStateAction<Filter>>
}

export interface IOrderModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    orderType: string
}

export interface IOfferProps {
    closeModal: () => void
    offerType: string,
    orderInfo: IOrder,
}

export interface IOrderPreview {
    tokenName: string,
    description: string,
    tokenImageUri: string
}

interface IOrderMenuProps {
    openMakeOrder: (type: string) => void
}

interface IMessage {
    error: null | string,
    success: null | string
}

interface MetaMaskError extends Error {
    error?: {
        message: string
    }
}
