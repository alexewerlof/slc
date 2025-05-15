import { defineAsyncComponent } from '../vendor/vue.js'
import { isInArr, isObj, isStr } from './validation.js'

/**
 * Loads a JS module from a given URL string.
 * @param {string} [jsUrlStr] the path to the JS file
 */
async function loadJs(jsUrlStr) {
    if (!jsUrlStr) {
        return {}
    }
    const mod = await import(jsUrlStr)
    if (!isObj(mod.default)) {
        throw new Error(`Module missing default export: ${jsUrlStr}`)
    }
    return mod.default
}

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 * @param {string} [htmlUrlStr] the path to the HTML file
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

/**
 * Loads a CSS file from a given URL string.
 * @param {string} [cssUrlStr] the path to the CSS file
 * @returns {Promise<void>} A promise that resolves when the CSS file is loaded.
 *          If no CSS file is specified or it is already loaded, it resolves immediately.
 *          If the CSS file fails to load, it rejects with an error.
 */
function loadCss(cssUrlStr) {
    return new Promise((resolve, reject) => {
        if (!cssUrlStr || isInArr(cssUrlStr, loadCss.loaded)) {
            resolve()
            return
        }
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = cssUrlStr
        // If there's an issue loading the CSS file, it will be logged in the console by the browser
        cssLink.onload = () => {
            loadCss.loaded.push(cssUrlStr)
            resolve()
        }
        cssLink.onerror = () => {
            reject(new Error(`Failed to load CSS: ${cssUrlStr}. Check browser console for details.`))
        }
        document.head.appendChild(cssLink)
    })
}
loadCss.loaded = []

/**
 * Gets a base url and return an object with the URLs for the HTML, JS, and CSS files.
 * @param {string} baseUrlStr
 * @param {boolean} hasHtml is there a .html file?
 * @param {boolean} hasJs is there a .js file?
 * @param {boolean} hasCss is there a .css file?
 * @returns {object} an object with the URLs for the HTML, JS, and CSS files
 */
export function getUrlStrs(resolve, relativeUrlBase, hasHtml, hasJs, hasCss) {
    const baseUrlStr = resolve(relativeUrlBase)
    if (!isStr(baseUrlStr)) {
        throw new Error(`Invalid baseUrlStr: ${baseUrlStr}`)
    }
    if (!hasHtml && !hasJs && !hasCss) {
        throw new Error(
            `The component at ${baseUrlStr} does not have HTML (${hasHtml}), JS (${hasJs}), or CSS (${hasCss})`,
        )
    }

    return {
        htmlUrlStr: hasHtml ? baseUrlStr + '.html' : undefined,
        jsUrlStr: hasJs ? baseUrlStr + '.js' : undefined,
        cssUrlStr: hasCss ? baseUrlStr + '.css' : undefined,
    }
}

/**
 * Loads the component's HTML template, JS module, and CSS file.
 * Combines the JS module's default export with the HTML template.
 * Handles potential loading errors by returning an error template.
 *
 * @param {object} urlStrs An object containing the URLs for the component assets.
 * @param {string} [urlStrs.htmlUrlStr] URL of the HTML template file.
 * @param {string} [urlStrs.jsUrlStr] URL of the JS module file.
 * @param {string} [urlStrs.cssUrlStr] URL of the CSS file.
 * @returns {Promise<object>} A promise that resolves to the component definition object
 *          (JS module defaults + template string) after the optional CSS is loaded.
 */
async function loadComponentDefinition(urlStrs) {
    try {
        const { htmlUrlStr, jsUrlStr, cssUrlStr } = urlStrs
        const [template, mod, _cssLoaded] = await Promise.all([
            loadHtml(htmlUrlStr),
            loadJs(jsUrlStr),
            loadCss(cssUrlStr),
        ])

        return {
            ...mod,
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
 * @param {string} htmlUrlStr the path to the HTML file
 * @param {string} jsUrlStr the path to the JS file
 * @param {string} cssUrlStr the path to the CSS file
 * @return {Promise<Component>} a promise that resolves to the component definition.
 *          In case of error, the promise will print to console and put the error message in the template.
 */
export function componentDefinition(isAsync, urlStrs) {
    if (isAsync) {
        return defineAsyncComponent(() => loadComponentDefinition(urlStrs))
    } else {
        return loadComponentDefinition(urlStrs)
    }
}
