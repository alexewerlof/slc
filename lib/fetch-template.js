import { defineAsyncComponent } from '../vendor/vue.js'
import { isStr } from './validation.js'

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

async function loadJsAndTemplate(urlBase, skipJs) {
    if (skipJs) {
        return {
            template: await fetchTemplate(urlBase + '.html'),
        }
    }
    const [mod, template] = await Promise.all([
        import(urlBase + '.js'),
        fetchTemplate(urlBase + '.html'),
    ])

    return {
        ...mod.default,
        template,
    }
}

function addComponent(app, urlBase, skipCss = false, skipJs = false) {
    const name = urlBase.split('/').pop().trim()
    app.component(
        name,
        defineAsyncComponent(async () => {
            // First try to load the CSS because while the browser is fetching it, the JS and HTML may be added too
            if (!skipCss) {
                addCssLink(urlBase + '.css')
            }
            try {
                return await loadJsAndTemplate(urlBase, skipJs)
            } catch (error) {
                console.error(`Error loading component ${name}:`, error)
                return {
                    template: `<div>Error loading component ${name}: ${error.message}</div>`,
                }
            }
        }),
    )
}

const componentDescriptors = [
    ['../../components/alert-chart-component'],
    ['../../components/alert-component', true],
    ['../../components/announcement-component'],
    ['../../components/axis-component'],
    ['../../components/burn-event-component'],
    ['../../components/burn-rate-component'],
    ['../../components/calculator-component', true],
    ['../../components/code-block-component'],
    ['../../components/condition-component', true],
    ['../../components/consumer-component', true],
    ['../../components/consumption-component', true],
    ['../../components/cookie-popup-component'],
    ['../../components/error-budget-component'],
    ['../../components/event-component', true],
    ['../../components/ext-link', true],
    ['../../components/failure-component', true],
    ['../../components/faq-component'],
    ['../../components/feedback-blob-component'],
    ['../../components/footer-component'],
    ['../../components/formula-component', true],
    ['../../components/header-component'],
    ['../../components/help-component'],
    ['../../components/hero-component'],
    ['../../components/indicator-component', true],
    ['../../components/inline-select-component'],
    ['../../components/metric-component', true],
    ['../../components/objective-component', true],
    ['../../components/percentage-overview-component'],
    ['../../components/plot-2d-component'],
    ['../../components/provider-component', true],
    ['../../components/risk-component', true],
    ['../../components/service-component', true],
    ['../../components/service-metric-component', true],
    ['../../components/show-hide-component'],
    ['../../components/steps-component'],
    ['../../components/summary-component', true],
    ['../../components/tabs-component'],
    ['../../components/tooltip-component', false, true],
]

export function addComponents(app) {
    componentDescriptors.forEach(([urlBase, skipCss, skipJs]) => {
        addComponent(app, urlBase, skipCss, skipJs)
    })
}

// This function isn't use anymore but is kept for reference
export function _getFileNameRoot(importMetaUrl) {
    if (!isStr(importMetaUrl) || importMetaUrl === '') {
        throw new Error('importMetaUrl is required. Pass import.meta.url as the second argument.')
    }

    if (!importMetaUrl.toLowerCase().endsWith('.js')) {
        throw new Error('importMetaUrl must end with ".js"')
    }

    return importMetaUrl.slice(0, -3) // Remove the extension
}

// This function isn't use anymore but is kept for reference
export async function loadComponent(importMetaUrl, skipCss = false) {
    const fileRoot = _getFileNameRoot(importMetaUrl)
    if (!skipCss) {
        addCssLink(fileRoot + '.css')
    }
    return await fetchTemplate(fileRoot + '.html')
}
