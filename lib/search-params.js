import { isStr } from './validation.js'

export function convertParam(valueType, paramStr) {
    if (!isStr(paramStr)) {
        throw new TypeError(`convertParam: paramStr must be a string. Got ${paramStr} (${typeof paramStr})`)
    }
    switch (valueType) {
        case String:
            return paramStr
        case Number:
            // Because Number('') === 0, we need to check for empty string
            if (paramStr.length === 0) {
                return undefined
            }
            const ret = Number(paramStr)
            if (!isNaN(ret)) {
                return ret
            }
            return undefined
        case undefined:
            return undefined
        default:
            throw new Error(`convertParam: unsupported type ${valueType} (${paramStr})`)
    }
}

export function getSearchParams(descriptor, url) {
    const params = {}
    for (const [ key, valueType ] of Object.entries(descriptor)) {
        const value = url.searchParams.get(key)
        if (value === null) {
            continue
        }
        var convertedParam = convertParam(valueType, value)
        if (convertedParam !== undefined) {
            params[key] = convertedParam
        }
    }
    return params
}

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
