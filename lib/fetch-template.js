import { defineAsyncComponent } from '../vendor/vue.js'
import { isStr } from './validation.js'

const addedCssHrefs = []
function loadCss(cssUrlStr) {
    return new Promise((resolve, reject) => {
        if (!cssUrlStr || addedCssHrefs.includes(cssUrlStr)) {
            resolve()
            return
        }
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = cssUrlStr
        // If there's an issue loading the CSS file, it will be logged in the console by the browser
        cssLink.onload = () => resolve()
        cssLink.onerror = () => reject(new Error(`Failed to load CSS: ${cssUrlStr}`))
        document.head.appendChild(cssLink)
        addedCssHrefs.push(cssUrlStr)
    })
}

function loadJs(jsUrlStr) {
    if (!jsUrlStr) {
        return { default: {} }
    }
    return import(jsUrlStr)
}

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 *
 * @param {string} htmlUrlStr the path to the HTML file
 */
export async function loadHtml(htmlUrlStr) {
    if (!isStr(htmlUrlStr)) {
        throw new Error(`Invalid HTML URL: ${htmlUrlStr}`)
    }
    const response = await fetch(htmlUrlStr)
    if (!response.ok) {
        throw new Error(`Failed to load template ${htmlUrlStr} HTTP ${response.status}`)
    }
    return await response.text()
}

async function loadComponentDefinition(jsUrlStr, htmlUrlStr, cssUrlStr) {
    try {
        const [mod, template, _cssLoaded] = await Promise.all([
            loadJs(jsUrlStr),
            loadHtml(htmlUrlStr),
            loadCss(cssUrlStr),
        ])

        return {
            ...mod.default,
            template,
        }
    } catch (error) {
        console.error(`Error loading component ${name}:`, error)
        return {
            template: `<div>Error loading component ${name}: ${error.message}</div>`,
        }
    }
}

export function componentDefinition(loadSync, jsUrlStr, htmlUrlStr, cssUrlStr) {
    if (loadSync) {
        return loadComponentDefinition(jsUrlStr, htmlUrlStr, cssUrlStr)
    } else {
        return defineAsyncComponent(() => loadComponentDefinition(jsUrlStr, htmlUrlStr, cssUrlStr))
    }
}
