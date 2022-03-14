import { useEffect, useState } from "react"
import { useWalletContext } from "../../context/walletContext"
import fetchOrdersList from '../../utils/fetchOrdersList'


const useApp = () => {
    const { accountInfo } = useWalletContext()
    const [orders, setOrders] = useState<string[]>([])
    const [filters, setFilters] = useState(
        {
            active: false,
            auction: false,
            buyItNow: false,
            your: false
        }
    )

    console.log(process.env.NEXT_PUBLIC_ETHERSCAN, process.env.NEXT_PUBLIC_DEXADDRESS)

    useEffect(() => {

        async function fetchOrdersFromContract() {
            const orders = await fetchOrdersList()
            setOrders(orders)
        }
        fetchOrdersFromContract()
    }, [])

    const setFilter = (filter: "active" | "auction" | "buyItNow" | "your") => {
        console.log('set filte', filter)
        setFilters({
            ...filters,
            [filter]: !filters[filter],
        })
    }

    return { orders, accountAddress: accountInfo.address, setFilter, filters }
}

export default useApp

