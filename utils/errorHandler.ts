import { MetaMaskError } from "../types/types"

export function txErrorHandler(): MethodDecorator {
    return function (target: Object, proprtyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalFn = descriptor.value
        descriptor.value = async function (...args: any) {
            try {
                return await originalFn.call(this, ...args)
            } catch (error) {
                console.log('error on: ', proprtyKey, 'Error:', error)
                let err = error as MetaMaskError
                if (err && err.message) {
                    if (err.error) return err.error.message
                    return err.message
                } else return 'unknown error'
            }
        }
    }
}

