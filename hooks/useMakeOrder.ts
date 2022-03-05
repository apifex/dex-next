import { useState, ChangeEventHandler } from 'react'
import { nftViewActions } from '../lib/nftViewActions'
import { useDexContract } from '../hooks/useDexContract'
import { useWalletContext } from '../context/walletContext'
import { INftMetadata, IOrderModalProps, IOrderPreview } from '../types/types'

export const useMakeOrder = ({ setIsOpen, orderType }: IOrderModalProps) => {
    const { accountInfo } = useWalletContext()
    const { makeOrder } = useDexContract()
    const [orderPreview, setOrderPreview] = useState<IOrderPreview | null>(null)
    const [isOwnerOrApproved, setIsOwnerOrApproved] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [dexMessage, setDexMessage] = useState<string | null>(null)
    const [inputValues, setInputValues] = useState({
        nftAddress: '',
        tokenId: '',
        startPrice: '',
        buyItNowPrice: '',
        endTime: '',
        endDate: ''
    })

    const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        setInputValues({ ...inputValues, [event.target.id]: event.target.value })
    }

    function isValidOrder(): boolean {
        return isOwnerOrApproved &&
            (orderType != 'fixed' ? Number(inputValues.startPrice) > 0 : true) &&
            (orderType != 'auction' ? Number(inputValues.buyItNowPrice) > 0 : true) &&
            (new Date(`${inputValues.endDate} ${inputValues.endTime}`) > new Date())
    }

    async function makeNewOrder() {
        if (accountInfo.address == '') setErrorMessage('Connect a Wallet first') 
        if (!isValidOrder()) {
            console.log(' no valid')
            return}
        const duration = String(Math.floor((new Date(`${inputValues.endDate} ${inputValues.endTime}`).getTime() - new Date().getTime()) / 1000))
        setIsProcessing(true)
        const response = await makeOrder(inputValues.nftAddress, inputValues.tokenId, orderType != 'fixed' ? inputValues.startPrice : inputValues.buyItNowPrice, duration, orderType, inputValues.buyItNowPrice)
        if (response == 'success') {
            setIsProcessing(false)
            setTimeout(() => closeModal(), 2000)
        } else {
            setIsProcessing(false)
            setTimeout(() => closeModal(), 2000)
        }
    }

    async function loadPreview() {
        if (inputValues.nftAddress == '' || inputValues.tokenId == '') {
            setOrderPreview(null)
            return
        }
        setErrorMessage('Loading Token info...')
        await getTokenInfo(inputValues.nftAddress, inputValues.tokenId)
    }

    async function getTokenInfo(nftaddress: string, tokenId: string) {
        try {
            const tokenInfoURI = await nftViewActions(nftaddress).getTokenURI(tokenId)
            const response = await fetch(tokenInfoURI)
            const tokenMetadata: INftMetadata = await response.json()
            const { properties } = tokenMetadata
            const tokenInfo = {
                tokenName: properties.name,
                description: properties.description,
                sellerAddress: '',
                tokenImageUri: properties.image
            }
            const isAllowed = await checkIsOwnerOrApproved(inputValues.nftAddress, inputValues.tokenId)

            setIsOwnerOrApproved(isAllowed)
            setErrorMessage(isAllowed ? '' : 'You are not allowed to trade with this Token')
            setOrderPreview(tokenInfo)
        } catch (error) {
            setOrderPreview(null)
            setErrorMessage('No token found')
            console.log(error)
        }
    }

    async function checkIsOwnerOrApproved(nftaddress: string, tokenId: string): Promise<boolean> {
        const owner = await nftViewActions(nftaddress).ownerOf(tokenId)
        const approved = await nftViewActions(nftaddress).getApproved(tokenId)
        const isApprovedForAll = await nftViewActions(nftaddress).isApprovedForAll(owner, accountInfo.address)
        const isOwner = String(owner) == accountInfo.address
        const isApproved = String(approved) == accountInfo.address

        return isOwner || isApproved || isApprovedForAll
    }

    function closeModal() {
        setOrderPreview(null)
        setErrorMessage('')
        setIsOpen(false)
    }

    return { inputHandler, loadPreview, makeNewOrder, closeModal, isProcessing, orderPreview, errorMessage, dexMessage }
}

