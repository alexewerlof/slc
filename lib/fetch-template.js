import { isStr } from './validation.js'

function templatePath(fileName, importMetaUrl) {
    if (!isStr(importMetaUrl) || importMetaUrl === '') {
        throw new Error('importMetaUrl is required. Pass import.meta.url as the second argument.')
    }

    const baseUrl = new URL('.', importMetaUrl)
    return new URL(fileName, baseUrl).href
}

/**
 * Loads a HTML template from a file and returns it as a string.
 * 
 * @param {string} fileName name of the html file to load
 * @param {string} importMetaUrl the value of import.meta.utl in the calling module
 */
export async function fetchTemplate(fileName, importMetaUrl) {
    const response = await fetch(templatePath(fileName, importMetaUrl))
    return await response.text()
}