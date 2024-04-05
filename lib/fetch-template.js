import { isStr } from './validation.js'

export function templatePath(importMetaUrl) {
    if (!isStr(importMetaUrl) || importMetaUrl === '') {
        throw new Error('importMetaUrl is required. Pass import.meta.url as the second argument.')
    }

    if (!importMetaUrl.endsWith('.js')) {
        throw new Error('importMetaUrl must end with ".js"')
    }

    return importMetaUrl.replace(/\.js$/, '.html')
}

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 * 
 * @param {string} importMetaUrl the value of import.meta.utl in the calling module
 */
export async function fetchTemplate(importMetaUrl) {
    const response = await fetch(templatePath(importMetaUrl))
    return await response.text()
}