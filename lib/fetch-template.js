import { isStr } from './validation.js'

export function _getFileNameRoot(importMetaUrl) {
    if (!isStr(importMetaUrl) || importMetaUrl === '') {
        throw new Error('importMetaUrl is required. Pass import.meta.url as the second argument.')
    }

    if (!importMetaUrl.endsWith('.js')) {
        throw new Error('importMetaUrl must end with ".js"')
    }

    return importMetaUrl.replace(/\.js$/, '')
}

const importedCssFiles = []
function addCssLink(cssPath) {
    if (importedCssFiles.includes(cssPath)) {
        return
    }
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = cssPath
    document.head.appendChild(cssLink)
    importedCssFiles.push(cssPath)
}

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 * 
 * @param {string} templatePath the path to the HTML file
 */
async function fetchTemplate(templatePath) {
    const response = await fetch(templatePath)
    return await response.text()
}

export async function loadComponent(importMetaUrl, skipCss = false) {
    const fileRoot = _getFileNameRoot(importMetaUrl)
    if (!skipCss) {
        addCssLink(fileRoot + '.css')
    }
    return await fetchTemplate(fileRoot + '.html')
}