import { isStr } from './validation.js'

export function getFileName(importMetaUrl) {
    if (!isStr(importMetaUrl) || importMetaUrl === '') {
        throw new Error('importMetaUrl is required. Pass import.meta.url as the second argument.')
    }

    if (!importMetaUrl.endsWith('.js')) {
        throw new Error('importMetaUrl must end with ".js"')
    }

    return importMetaUrl.replace(/\.js$/, '')
}

loadCss.importedFiles = []
export function loadCss(importMetaUrl) {
    const cssPath = getFileName(importMetaUrl) + '.css'
    if (loadCss.importedFiles.includes(cssPath)) {
        return
    }
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = cssPath
    document.head.appendChild(cssLink)
    loadCss.importedFiles.push(cssPath)
}

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 * 
 * @param {string} importMetaUrl the value of import.meta.utl in the calling module
 */
export async function fetchTemplate(importMetaUrl) {
    const templatePath = getFileName(importMetaUrl) + '.html'
    const response = await fetch(templatePath)
    return await response.text()
}