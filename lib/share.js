import { convertParam } from './search-params.js'
import { convertV0toV3, convertV1toV3, convertV2toV3, parseUrlV0, parseUrlV1, parseUrlV2, parseUrlV3 } from './share-legacy.js'
import { isStr } from './validation.js'

export function urlToState(urlStr) {
    if (!isStr(urlStr)) {
        throw new TypeError(`urlToState(): urlStr must be a string. Got ${urlStr}`)
    }
    const u = new URL(urlStr)
    const ver = convertParam(Number, u.searchParams.get('urlVer'))
    switch (ver) {
        case undefined:
        case 0:
            return convertV0toV3(parseUrlV0(u))
        case 1:
            return convertV1toV3(parseUrlV1(u))
        case 2:
            return convertV2toV3(parseUrlV2(u))
        case 3:
            return parseUrlV3(u)
        default:
            throw new Error(`urlToState(): Unknown URL version: ${ ver }`)
    }
}

export function stateToUrl(url, state) {
    url.searchParams.append('state', JSON.stringify(state))
    return url
}

export async function loadJson(jsonUrl) {
    const response = await fetch(jsonUrl)
    return await response.json()
}

export function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(file)
    })
}
