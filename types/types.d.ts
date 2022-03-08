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

export interface ICardProps extends IOrder {
    orderIndex: number,
    openOffer: (orderIndex: number, offerType: string) => void,
    claim: (orderId: string) => Promise<string>,
    cancelOrder: (orderId: string) => Promise<string>,
    fetchOrders: () => void
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
    isConnected: boolean,
    signer: JsonRpcSigner | null,
    accountInfo: IAccountInfo,
    updateAccountInfo: (accountInfo: IAccountInfo) => void,
    clearAccountInfo: () => void,
    updateSigner: (newSigner: JsonRpcSigner) => void
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
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    orderType: string
}

export interface IOfferProps {
    isMakeOfferOpen: boolean,
    setIsMakeOfferOpen: Dispatch<SetStateAction<boolean>>,
    orderInfo: { order: IOrder, offerType: string },
}

export interface IOrderPreview {
    tokenName: string,
    description: string,
    sellerAddress: string,
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

export enum Filter {
    all,
    onlyActive,
    onlyOwner,
    onlyBuyItNow,
    onlyBid
   }