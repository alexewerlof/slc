import { defineAsyncComponent } from '../vendor/vue.js'
import { isInArr, isObj, isStr, isStrLen } from './validation.js'

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
 * Loads the component's HTML template, JS module, and CSS file.
 * Combines the JS module's default export with the HTML template.
 * Handles potential loading errors by returning an error template.
 */
async function loadComponent(htmlUrlStr, jsUrlStr, cssUrlStr) {
    try {
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

export function parseComponentSpec(componentSpec, resolve) {
    const lastDot = componentSpec.lastIndexOf('.')
    if (lastDot === -1) {
        throw new Error(`Invalid componentSpec: ${componentSpec}`)
    }
    const flags = componentSpec.slice(lastDot + 1).trim().toLowerCase()
    if (flags.length <= 1) {
        throw new SyntaxError(`Empty flags: ${componentSpec} => '${flags}'`)
    }
    if (flags.length > 4) {
        throw new SyntaxError(`Too many flags: ${componentSpec} => '${flags}'`)
    }
    const relativeUrlBase = componentSpec.slice(0, lastDot).trim()
    if (!isStrLen(relativeUrlBase, 5)) {
        throw new Error(`Invalid relativeUrlBase: ${relativeUrlBase}`)
    }
    const name = relativeUrlBase.split('/').pop()
    const nameRegex = /^[a-zA-Z0-9-]+$/
    if (!isStrLen(name, 3) || !nameRegex.test(name)) {
        throw new Error(`Invalid component name: ${name}`)
    }

    const baseUrlStr = resolve(relativeUrlBase)
    if (!isStr(baseUrlStr)) {
        throw new Error(`Invalid baseUrlStr: ${baseUrlStr}`)
    }
    if (!flags.includes('h') && !flags.includes('j') && !flags.includes('c')) {
        throw new Error(
            `The component at ${baseUrlStr} does not have HTML (${hasHtml}), JS (${hasJs}), or CSS (${hasCss})`,
        )
    }

    return {
        name,
        isAsync: flags.includes('&'),
        htmlUrlStr: flags.includes('h') ? baseUrlStr + '.html' : undefined,
        jsUrlStr: flags.includes('j') ? baseUrlStr + '.js' : undefined,
        cssUrlStr: flags.includes('c') ? baseUrlStr + '.css' : undefined,
    }
}

async function registerComponent(app, componentSpec, resolve) {
    const { name, isAsync, htmlUrlStr, jsUrlStr, cssUrlStr } = parseComponentSpec(componentSpec, resolve)
    if (isAsync) {
        app.component(name, defineAsyncComponent(() => loadComponent(htmlUrlStr, jsUrlStr, cssUrlStr)))
    } else {
        app.component(name, await loadComponent(htmlUrlStr, jsUrlStr, cssUrlStr))
    }
}

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 * @param {Array<string>} componentSpecs an array of component specifications
 * @param {function} resolve a function to resolve the component's URL. Get it from import.meta.resolve
 */
export async function registerComponents(app, componentSpecs, resolve) {
    await Promise.all(
        componentSpecs.map((componentSpec) => registerComponent(app, componentSpec, resolve)),
    )
}
