import { config } from '../config.js'
import { parseParamValue } from './search-params.js'
import {
    convertV0toV3,
    convertV1toV3,
    convertV2toV3,
    parseUrlV0,
    parseUrlV1,
    parseUrlV2,
    parseUrlV3,
} from './share-legacy.js'
import { isInstance, isStr } from './validation.js'

export function urlToState(url) {
    if (!isInstance(url, URL)) {
        throw new TypeError(`Expected URL, got ${url} (${typeof url})`)
    }
    const urlVer = parseParamValue(Number, url.searchParams.get('urlVer'))
    switch (urlVer) {
        case undefined:
        case 0:
            return convertV0toV3(parseUrlV0(url))
        case 1:
            return convertV1toV3(parseUrlV1(url))
        case 2:
            return convertV2toV3(parseUrlV2(url))
        case 3:
            return parseUrlV3(url)
        default:
            throw new Error(`urlToState(): Unknown URL version: ${urlVer}`)
    }
}

/**
 * Converts the given state object to a URL.
 * @param {URL} url - The URL to convert the state to.
 * @param {Object} state - The state object to convert.
 * @returns {URL} The URL with the state appended as a query parameter.
 */
export function stateToUrl(url, state) {
    url.searchParams.set('urlVer', config.urlVer)
    url.searchParams.append('state', JSON.stringify(state))
    return url
}

export function stateToCurrentUrl(state) {
    const url = new URL(globalThis.location.href)
    return stateToUrl(url, state).toString()
}

export function currentUrlToState() {
    const url = new URL(globalThis.location.href)
    return urlToState(url).state
}

export async function loadJson(url) {
    if (!isStr(url) && !isInstance(url, URL)) {
        throw new Error(`Invalid url: ${url}`)
    }
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${url} HTTP ${response.status}`)
    }
    return await response.json()
}

export async function loadText(url) {
    if (!isStr(url) && !isInstance(url, URL)) {
        throw new Error(`Invalid url: ${url}`)
    }
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch text ${url} HTTP ${response.status}`)
    }
    return await response.text()
}

export function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(file)
    })
}
