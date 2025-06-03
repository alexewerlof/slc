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
 * @param {Object} urlStrs - An object containing the URLs for the HTML, JS, and CSS files.
 * @param {string|undefined} urlStrs.html - The URL for the HTML file.
 * @param {string|undefined} urlStrs.js - The URL for the JS file.
 * @param {string|undefined} urlStrs.css - The URL for the CSS file.
 * @returns {Promise<Object>} A promise that resolves to an object containing the template and module.
 *          If the loading fails, it resolves to an object with an error message in the template.
 */
async function loadComponent(urlStrs) {
    try {
        const [template, mod, _cssLoaded] = await Promise.all([
            loadHtml(urlStrs.html),
            loadJs(urlStrs.js),
            loadCss(urlStrs.css),
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
        urlStrs: {
            html: flags.includes('h') ? baseUrlStr + '.html' : undefined,
            js: flags.includes('j') ? baseUrlStr + '.js' : undefined,
            css: flags.includes('c') ? baseUrlStr + '.css' : undefined,
        },
    }
}

/**
 * Creates a <lik re="preload|prefetch"> element and adds it to the document <head> element.
 * @param {string} href the link "href" attribute
 * @param {string} linkAs the link "as" attribute
 * @param {boolean} [prio] when set to a truthy value, a 'preload' link is created. Otherwise a 'prefetch' is created
 * The difference lies in the priority of loading the resource to the browser cache where preload has higher prio.
 */
function addPre(href, linkAs = 'fetch', prio = false) {
    const link = document.createElement('link')
    link.rel = prio ? 'preload' : 'prefetch'
    link.href = href
    link.as = linkAs
    document.head.appendChild(link)
}

/**
 * Gives hints to the browser to download and cache resources
 * @param {object} urlStrs
 */
function preload(urlStrs) {
    if (urlStrs.html) {
        addPre(urlStrs.html, 'fetch')
    }
    if (urlStrs.js) {
        addPre(urlStrs.js, 'script')
    }
    if (urlStrs.css) {
        addPre(urlStrs.css, 'style')
    }
}

/**
 * @param {VueApplication} app a reference to the Vue application instance
 * @param {string} componentSpec a component specification string
 *      The string should be in the format: './path/to/component.h[j][c][&]'
 *      where:
 *      - 'j' indicates a JS module
 *      - 'h' indicates an HTML template (mandatory)
 *      - 'c' indicates a CSS file
 *      - '&' indicates that the component should be loaded asynchronously
 * @param {function} resolve a function to resolve the component's URL.
 *      Get it from import.meta.resolve of the same file where componentSpecs paths are defined.
 */
async function registerComponent(app, componentSpec, resolve) {
    const { name, isAsync, urlStrs } = parseComponentSpec(componentSpec, resolve)
    if (isAsync) {
        preload(urlStrs)
        app.component(name, defineAsyncComponent(() => loadComponent(urlStrs)))
    } else {
        app.component(name, await loadComponent(urlStrs))
    }
}

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 * @param {Array<string>} componentSpecs an array of component specifications
 * @param {function} resolve a function to resolve the component's URL.
 *      Get it from import.meta.resolve of the same file where componentSpecs paths are defined.
 */
export async function registerComponents(app, componentSpecs, resolve) {
    await Promise.all(
        componentSpecs.map((componentSpec) => registerComponent(app, componentSpec, resolve)),
    )
}
