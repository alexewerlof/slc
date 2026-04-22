import { isObj, isStr } from './validation.js'

/**
 * Parses a raw URL search parameter string to the given type.
 * @param {StringConstructor|NumberConstructor|ObjectConstructor} valueType the target type constructor
 * @param {string|undefined} paramStr the raw parameter string
 * @returns {string|number|Object|undefined}
 */
export function parseParamValue(valueType, paramStr) {
    if (!isStr(paramStr)) {
        return undefined
    }
    switch (valueType) {
        case String: {
            return paramStr
        }
        case Number: {
            // Because Number('') === 0 and Number('   ') === 0, we need to check for empty string
            if (paramStr.trim().length === 0) {
                return undefined
            }
            const ret = Number(paramStr)
            return isNaN(ret) ? undefined : ret
        }
        case Object: {
            return JSON.parse(paramStr)
        }
        default: {
            throw new TypeError(`parseParamValue: unsupported type ${valueType} (${paramStr})`)
        }
    }
}

/**
 * Extracts and converts search params from a URL according to a descriptor map.
 * @param {Record<string, StringConstructor|NumberConstructor|ObjectConstructor>} descriptor
 *   maps param key to its expected type constructor
 * @param {URL} url
 * @returns {Record<string, string|number|Object>}
 */
export function getSearchParams(descriptor, url) {
    if (!isObj(descriptor)) {
        throw new TypeError(`getSearchParams: descriptor must be an object. Got ${descriptor} (${typeof descriptor})`)
    }
    if (url instanceof URL === false) {
        throw new TypeError(`getSearchParams: url must be an instance of URL. Got ${url} (${typeof url})`)
    }
    const params = {}
    for (const [key, valueType] of Object.entries(descriptor)) {
        const value = url.searchParams.get(key)
        if (value === null) {
            continue
        }
        const convertedParam = parseParamValue(valueType, value)
        if (convertedParam !== undefined) {
            params[key] = convertedParam
        }
    }
    return params
}

/**
 * Writes descriptor values from params back into the URL search params.
 * @param {Record<string, *>} descriptor maps param keys (values are ignored)
 * @param {URL} url the URL to modify in place
 * @param {Record<string, *>} params the values to write
 * @returns {URL} the same URL instance
 */
export function setSearchParams(descriptor, url, params) {
    for (const key of Object.keys(descriptor)) {
        const value = params[key]
        if (value === undefined || value === null) {
            continue
        }
        url.searchParams.set(key, value)
    }
    return url
}
