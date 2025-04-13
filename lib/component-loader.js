import { defineAsyncComponent } from '../vendor/vue.js'
import { isInArr, isStr } from './validation.js'

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
async function loadHtml(htmlUrlStr) {
    if (!isStr(htmlUrlStr)) {
        throw new Error(`Invalid HTML URL: ${htmlUrlStr}`)
    }
    const response = await fetch(htmlUrlStr)
    if (!response.ok) {
        throw new Error(`Failed to load template ${htmlUrlStr} HTTP ${response.status}`)
    }
    return await response.text()
}

const addedCssHrefs = []
function loadCss(cssUrlStr) {
    return new Promise((resolve, reject) => {
        if (!cssUrlStr || isInArr(cssUrlStr, addedCssHrefs)) {
            resolve()
            return
        }
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = cssUrlStr
        // If there's an issue loading the CSS file, it will be logged in the console by the browser
        cssLink.onload = () => {
            addedCssHrefs.push(cssUrlStr)
            resolve()
        }
        cssLink.onerror = () => {
            reject(new Error(`Failed to load CSS: ${cssUrlStr}. Check browser console for details.`))
        }
        document.head.appendChild(cssLink)
    })
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
        console.error(error)
        return {
            template: `<div>${error}</div>`,
        }
    }
}

/**
 * Returns the component definition which can be used with the `app.component('name', DEFINITION)` call.
 * Note: You should `await` on the response of this function.
 * @param {Boolean} isAsync should the component be loaded synchronously or asynchronously
 * @param {string} jsUrlStr the path to the JS file
 * @param {string} htmlUrlStr the path to the HTML file
 * @param {string} cssUrlStr the path to the CSS file
 * @return {Promise<Component>} a promise that resolves to the component definition.
 *          In case of error, the promise will print to console and put the error message in the template.
 */
export function componentDefinition(isAsync, jsUrlStr, htmlUrlStr, cssUrlStr) {
    if (isAsync) {
        return defineAsyncComponent(() => loadComponentDefinition(jsUrlStr, htmlUrlStr, cssUrlStr))
    } else {
        return loadComponentDefinition(jsUrlStr, htmlUrlStr, cssUrlStr)
    }
}
