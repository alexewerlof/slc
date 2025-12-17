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
import { isFn, isInstance, isStr } from './validation.js'

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
    if (url.searchParams.has('state')) {
        console.warn('The URL already has a state:', url.toString())
    }
    url.searchParams.set('state', JSON.stringify(state))
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

export async function parseStateString(stateString) {
    if (!isStr(stateString)) {
        throw new TypeError(`Cannot parse ${typeof stateString} value: ${stateString}`)
    }
    stateString = stateString.trim()
    if (stateString.startsWith('{')) {
        return JSON.parse(stateString)
    }
    if (stateString.startsWith('http')) {
        const url = new URL(stateString)
        return urlToState(url).state
    }
    const YAML = await import('../vendor/yaml.js')
    return YAML.parse(stateString)
}

/**
 * Triggers a browser download for the given text content.
 *
 * @param {string} content The text content to download.
 * @param {string} fileName The name of the file to be saved.
 * @param {string} [contentType='text/plain'] The MIME type of the content.
 */
export function downloadFile(content, fileName, contentType = 'text/plain') {
    if (!isStr(content)) {
        throw new TypeError(`Expected a string for content. Got ${content} (${typeof content})`)
    }

    if (!isStr(fileName)) {
        throw new TypeError(`Expected a string for fileName. Got ${fileName} (${typeof fileName})`)
    }

    // 1. Create a Blob from the content and content type.
    const blob = new Blob([content], { type: contentType })

    // 2. Create an object URL for the Blob.
    const url = URL.createObjectURL(blob)

    // 3. Create a temporary anchor element.
    const a = document.createElement('a')

    // 4. Set the anchor's attributes.
    a.href = url
    a.download = fileName
    // Hide the anchor from view.
    a.style.display = 'none'

    // 5. Append the anchor to the body, trigger the click, and then remove it.
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // 6. Revoke the object URL to free up memory.
    URL.revokeObjectURL(url)
}

export async function saveAs(content, fileName, contentType = 'text/plain') {
    try {
        if (!isFn(window.showSaveFilePicker)) {
            throw new Error('Your browser does not support Save File Picker')
        }
        const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            /*
            types: [
                {
                    description: 'Text Files',
                    accept: { [contentType]: ['.txt'] },
                },
            ],
            */
        })
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
        return true
    } catch (err) {
        // AbortError is expected if the user cancels the dialog.
        if (err?.name !== 'AbortError') {
            return false
        }
        throw err
    }
}
