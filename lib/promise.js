import { isFn } from './validation.js'

/**
 * Creates a single-flight version of an asynchronous function.
 * This means if the function is called multiple times while an execution is already
 * in progress, subsequent calls will return the promise of the ongoing execution
 * rather than starting new ones.
 *
 * @param {Function} asyncFn - The asynchronous function to wrap.
 * @returns {Function} A new asynchronous function with single-flight behavior.
 */
export function createSingleFlight(asyncFn) {
    if (!isFn(asyncFn)) {
        throw new TypeError(`Expected a function. Got ${asyncFn} (${typeof asyncFn})`)
    }

    let outerPromise = null

    return async (...args) => {
        if (outerPromise) {
            return outerPromise
        }

        const innerPromise = outerPromise = asyncFn(...args)
        try {
            await innerPromise
            outerPromise = null
        } catch (_err) {
            outerPromise = null
        }

        return innerPromise
    }
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
