import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { IOrdersContext } from '../types/types'

enum Filter {
    all,
    onlyActive,
    onlyOwner,
    onlyBuyItNow,
    onlyBid
}


const FilterMenu = ({ setFilterType }: IOrdersContext["setFilterType"]) => {
    const [onlyActive, setOnlyActive] = useState(false)
    const [onlyBid, setOnlyBid] = useState(false)
    const onlyActiveHandler = () => {
        setOnlyActive(!onlyActive)
        setFilterType(!onlyActive ? Filter.onlyActive : Filter.all)
    }

    return (
        <Switch.Group>
            <div className="m-4 items-center">
                <Switch.Label className="mr-4">Only Active</Switch.Label>
                <Switch
                    checked={onlyActive}
                    onChange={onlyActiveHandler}
                    className={`${onlyActive ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                    <span className={`${onlyActive ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                </Switch>
            </div>
           
        </Switch.Group>
    )
}

export default FilterMenu


