import { Switch } from '@headlessui/react'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { IFilters } from '../../types/types'


interface IFilterMenu {
    setFilter: (filter: "active" | "auction" | "buyItNow" | "your") => void,
    filters: IFilters
}

const FilterMenu = ({ setFilter, filters }: IFilterMenu) => {

    const { active, auction, buyItNow, your } = filters
    const filterType: {name: string, id: 'active' | 'auction' | 'buyItNow' | 'your', state: boolean}[] = [
        { name: 'Only Active', id: 'active', state: active },
        { name: 'Only Auction', id: 'auction', state: auction },
        { name: 'Only Buy it Now', id: 'buyItNow', state: buyItNow },
        { name: 'Only Your', id: 'your', state: your }
    ]
    return (
        <Switch.Group>
            <div className='m-4 flex md:hidden'>
                <div>
                </div>
                <Popover >
                    {({ open }) => (
                        <>
                            <Popover.Button className={`${open ? '' : 'text-opacity-90'} flex`}>
                                <span>Filters:</span>
                                <div className="ml-2 space-y-2">
                                    <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                                    <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                                    <span className="block w-8 h-0.5 bg-gray-600 animate-pulse"></span>
                                </div>

                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10 right-5  w-64 px-2 mt-2">
                                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="relative grid gap-8 bg-white p-7">
                                            {filterType.map(filter =>
                                                <div key={filter.id} className="items-center">
                                                    <Switch
                                                        checked={filter.state}
                                                        onChange={() => setFilter(filter.id)}
                                                        className={`${filter.state ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                                                        <span className={`${filter.state ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                                    </Switch>
                                                    <Switch.Label className="ml-4">{filter.name}</Switch.Label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
            <div className='hidden md:flex'>
                {filterType.map(filter =>
                    <div key={filter.id + 'long'} className="m-4 items-center">
                        <Switch.Label className="mr-4">{filter.name}</Switch.Label>
                        <Switch
                            checked={filter.state}
                            onChange={() => setFilter(filter.id)}
                            className={`${filter.state ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                            <span className={`${filter.state ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                        </Switch>
                    </div>
                )}
            </div>
        </Switch.Group>
    )
}

export default FilterMenu


