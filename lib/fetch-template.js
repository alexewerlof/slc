import { defineAsyncComponent } from '../vendor/vue.js'
import { getText } from './fetch-utils.js'
import { isStr } from './validation.js'

const addedCssHrefs = []
function addCssLink(cssUrlStr) {
    if (!cssUrlStr || addedCssHrefs.includes(cssUrlStr)) {
        return
    }
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = cssUrlStr
    // If there's an issue loading the CSS file, it will be logged in the console by the browser
    document.head.appendChild(cssLink)
    addedCssHrefs.push(cssUrlStr)
}

async function loadComponentDefinition(htmlUrlStr, jsUrlStr) {
    try {
        if (!isStr(htmlUrlStr)) {
            throw new Error(`Invalid HTML URL: ${htmlUrlStr}`)
        }
        if (!isStr(jsUrlStr)) {
            return {
                template: await getText(htmlUrlStr),
            }
        }

        const [mod, template] = await Promise.all([
            import(jsUrlStr),
            getText(htmlUrlStr),
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

export function addComponent(app, name, jsUrlStr, htmlUrlStr, cssUrlStr) {
    app.component(
        name,
        defineAsyncComponent(async () => {
            // First try to load the CSS because while the browser is fetching it, the JS and HTML may be added too
            addCssLink(cssUrlStr)
            return await loadComponentDefinition(htmlUrlStr, jsUrlStr)
        }),
    )
}
