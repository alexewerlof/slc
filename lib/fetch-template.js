import { defineAsyncComponent } from '../vendor/vue.js'
import { getText } from './fetch-utils.js'
import { isStr } from './validation.js'

const addedCssHrefs = []
function addCssLink(cssUrlStr) {
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

async function loadComponentDefinition(htmlUrlStr, jsUrlStr, cssUrlStr) {
    try {
        if (!isStr(htmlUrlStr)) {
            throw new Error(`Invalid HTML URL: ${htmlUrlStr}`)
        }

        const [mod, template, _cssLoaded] = await Promise.all([
            loadJs(jsUrlStr),
            getText(htmlUrlStr),
            addCssLink(cssUrlStr),
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

export async function addComponent(app, name, loadSync, jsUrlStr, htmlUrlStr, cssUrlStr) {
    loadSync = true
    if (loadSync) {
        app.component(
            name,
            await loadComponentDefinition(htmlUrlStr, jsUrlStr, cssUrlStr),
        )
    } else {
        app.component(
            name,
            defineAsyncComponent(async () => {
                // First try to load the CSS because while the browser is fetching it, the JS and HTML may be added too
                return await loadComponentDefinition(htmlUrlStr, jsUrlStr, cssUrlStr)
            }),
        )
    }
}
