import { IOrderPreview } from "../../types/types"


const OrderPreview = ({ tokenName, description, tokenImageUri }: IOrderPreview) => {
    return (
        <div className='max-w-sm text-center rounded overflow-hidden m-4 shadow-lg'>
            <h3 className='p-4 font-bold text-xl text-center m-2'>{tokenName}</h3>
            <img className='px-4' src={tokenImageUri} alt='crypto1' ></img>
            <div className='px-6 py-4'>
                <p className='text-gray-700 text-base'>{description}</p>
            </div>
        </div>

    )
}

export default OrderPreview