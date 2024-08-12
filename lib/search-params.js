import { isObj, isStr } from './validation.js'

export function convertParam(valueType, paramStr) {
    if (!isStr(paramStr)) {
        return undefined
    }
    switch (valueType) {
        case String:
            return paramStr
        case Number:
            // Because Number('') === 0 and Number('   ') === 0, we need to check for empty string
            if (paramStr.trim().length === 0) {
                return undefined
            }
            const ret = Number(paramStr)
            return isNaN(ret) ? undefined : ret
        case undefined:
            return undefined
        default:
            throw new TypeError(`convertParam: unsupported type ${valueType} (${paramStr})`)
    }
}

export function getSearchParams(descriptor, url) {
    if (!isObj(descriptor)) {
        throw new TypeError(`getSearchParams: descriptor must be an object. Got ${descriptor} (${typeof descriptor})`)
    }
    if (url instanceof URL === false) {
        throw new TypeError(`getSearchParams: url must be an instance of URL. Got ${url} (${typeof url})`)
    }
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
