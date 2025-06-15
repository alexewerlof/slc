import { isFn } from './validation.js'

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

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

    return async function singleFlight(...args) {
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

/**
 * Creates a sequential executor for an asynchronous function.
 * If the wrapped function is called multiple times, each call will be queued
 * and executed only after the previous call has completed. Each call
 * receives its own arguments and its own result.
 *
 * @param {Function} asyncFn - The asynchronous function to wrap.
 * @returns {Function} A new asynchronous function that executes calls sequentially.
 */
export function createSequentialExecutor(asyncFn) {
    if (!isFn(asyncFn)) {
        throw new TypeError(`Expected a function. Got ${asyncFn} (${typeof asyncFn})`)
    }

    let lastTaskPromise = Promise.resolve()

    return function sequentialExecutor(...args) {
        async function sequentialExecution() {
            await Promise.allSettled([lastTaskPromise])
            return asyncFn(...args)
        }

        return lastTaskPromise = sequentialExecution()
    }
}
