import { useState, ChangeEventHandler } from 'react'
import { IOrderModalProps, IOrderPreview } from '../../types/types'
import DexController from '../../controllers/dexTransactionsController'
import NftController from '../../controllers/nftController'
import DexAbi from '../../abi/DEX.json'

import { useWalletContext } from '../../context/walletContext'
import fetchTokenInfo from '../../utils/fetchTokenInfo'

export const useMakeOrder = ({ setIsOpen, orderType }: IOrderModalProps) => {
    const userAddress = useWalletContext().accountInfo.address
    const dex = DexController.getInstance()

    const [nft, setNft] = useState<NftController | null>(null)

    const [orderPreview, setOrderPreview] = useState<IOrderPreview | null>(null)
    const [isOwnerOrApproved, setIsOwnerOrApproved] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [processing, setProcessing] = useState<{ isProcessing: boolean, message: string }>({ isProcessing: false, message: '' })
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
        nftAddress: '',
        tokenId: '',
        startPrice: '',
        buyItNowPrice: '',
        endTime: '',
        endDate: '',
    })
    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({
        nftAddress: '',
        tokenId: '',
        startPrice: '',
        buyItNowPrice: '',
        endTime: '',
        endDate: '',
    })

    const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        setErrorMessage('')
        setInputErrors({ ...inputErrors, [event.target.id]: '' })
        console.log(inputErrors)
        setInputValues({ ...inputValues, [event.target.id]: event.target.value })
        if (event.target.id == 'tokenId' || event.target.id == 'nftAddress') setOrderPreview(null)
        console.log(inputValues)
    }

    async function loadPreview() {
        if (inputValues.tokenId == '' || inputValues.nftAddress.length != 42) {
            setErrorMessage('Contract address or token ID are not valid')
            return
        }
        const nftContract = NftController.getInstance(inputValues.nftAddress)
        setNft(nftContract)
        setErrorMessage('Loading Token info...')
        const tokenInfo = await fetchTokenInfo(nftContract, inputValues.tokenId)
        if (tokenInfo instanceof Error) {
            setErrorMessage('Error when loading token info')
            return
        }
        setOrderPreview(tokenInfo)

        const isAllowed = await checkIsOwnerOrApproved(nftContract, inputValues.tokenId)
        setIsOwnerOrApproved(isAllowed)
        setErrorMessage(isAllowed ? '' : 'You are not allowed to trade with this Token')
    }

    async function checkIsOwnerOrApproved(nft: NftController, tokenId: string): Promise<boolean> {
        if (!nft) return false
        const owner = await nft.ownerOf(tokenId)
        const approved = await nft.getApproved(tokenId)
        const isApprovedForAll = await nft.isApprovedForAll(owner, userAddress)
        const isOwner = String(owner) == userAddress
        const isApproved = String(approved) == userAddress
        return isOwner || isApproved || isApprovedForAll
    }

    const isValidInput: ChangeEventHandler<HTMLInputElement> = (event) => {
        switch (event.currentTarget.id) {
            case ('nftAddress'):
                if (inputValues.nftAddress.length != 42) setInputErrors({ ...inputErrors, nftAddress: 'Not valid address' })
                break
            case ('tokenId'):
                if (inputValues.tokenId == '') {
                    setInputErrors({ ...inputErrors, tokenId: 'Not valid token Id' })
                } else {
                    loadPreview()
                }
                break
            case ('startPrice'):
                if (Number(inputValues.startPrice) <= 0) setInputErrors({ ...inputErrors, startPrice: 'Price must be greater than 0' })
                break
            case ('buyItNowPrice'):
                if (Number(inputValues.buyItNowPrice) <= 0) setInputErrors({ ...inputErrors, buyItNowPrice: 'Price must be greater than 0' })
                break
            case ('endDate'):
                if (new Date(inputValues.endDate) < new Date()) setInputErrors({ ...inputErrors, endDate: 'Not valid date' })
                break
            case ('endTime'):
                if (new Date(`${inputValues.endDate} ${inputValues.endTime}`) < new Date()) setInputErrors({ ...inputErrors, endTime: 'Not valid date' })
                break
        }
    }

    function isValidOrder(): boolean {
        return (isOwnerOrApproved &&
            inputErrors.nftAddress == '' &&
            inputErrors.tokenId == '' &&
            inputErrors.startPrice == '' &&
            inputErrors.buyItNowPrice == '' &&
            inputErrors.endTime == '')
    }

    async function makeNewOrder() {
        if (!isValidOrder() || !nft) {
            setErrorMessage('This order is not valid. Please fill with correct datas.')
            return
        }
        setProcessing({ isProcessing: true, message: 'Processing... it will take some time... 2 transaction should be confirmed in Metamask' })
        const { nftAddress, tokenId, startPrice, buyItNowPrice, endTime, endDate } = inputValues
        const duration = String(Math.floor((new Date(`${endDate} ${endTime}`).getTime() - new Date().getTime()) / 1000))
        const approveTx = await nft.approve(process.env.NEXT_PUBLIC_DEXADDRESS as string, tokenId)
        if (approveTx != 'success') {
            setProcessing({ isProcessing: false, message: '' })
            setErrorMessage(approveTx)
            return
        }

        let makeOrderTx = ''
        switch (orderType) {
            case 'auction':
                makeOrderTx = await dex.makeAuctionOrder(nftAddress, tokenId, startPrice.toString(), duration)
                break
            case 'fixed':
                makeOrderTx = await dex.makeFixedPriceOrder(nftAddress, tokenId, buyItNowPrice.toString(), duration)
                break
            case 'mixed':
                makeOrderTx = await dex.makeMixedOrder(nftAddress, tokenId, startPrice.toString(), buyItNowPrice.toString(), duration)
                break
        }

        if (makeOrderTx == 'success') {
            setProcessing({ isProcessing: false, message: 'success' })
        } else {
            setProcessing({ isProcessing: false, message: '' })
            setErrorMessage(makeOrderTx)
        }
    }

    function closeModal() {
        setOrderPreview(null)
        setErrorMessage('')
        setIsOpen(false)
    }

    //TODO finish message and upadate state

    return { inputHandler, inputValues, inputErrors, loadPreview, confirm: makeNewOrder, closeModal, isValidInput, processing, orderPreview, errorMessage }
}

