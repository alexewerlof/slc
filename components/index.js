import { componentDefinition, getUrlStrs } from '../lib/component-loader.js'
import { isStrLen } from '../lib/validation.js'

const componentSpecifications = [
    './assessment-component.jh&',
    './alert/alert-chart-component.jhc&',
    './alert/alert-component.jh&',
    './ui/announcement-component.jhc&',
    './axis-component.jhc&',
    './alert/burn-event-component.jhc&',
    './alert/burn-rate-component.jhc&',
    './calculator-component.jhc&',
    './chat-component.jh&',
    './chat-thread-component.jhc&',
    './ui/code-block-component.jhc&',
    './ui/book-cover-component.hc&',
    './assessment-component-intro.jh&',
    // TODO: needs a rewrite or remove
    './condition-component.jh&',
    './consumer-component.jh&',
    './consumption-component.jh&',
    './ui/cookie-popup-component.jhc&',
    './ui/dialog-component.jhc&',
    './objective/error-budget-component.jhc&',
    // TODO: needs a rewrite or remove
    './event-component.jh&',
    './ext-link.jh',
    './failure-component.jh&',
    './dependency-component.jh&',
    './faq-component.jhc&',
    './feedback-blob-component.jhc&',
    './footer-component.jhc&',
    './formula-component.jh&',
    './ui/header-component.jhc&',
    './ui/help-component.jhc',
    './ui/hero-component.jhc&',
    './assessment-graph-component.jhc&',
    './failure-sort-component.jhc&',
    './indicator/indicator-component.jh&',
    './indicator/indicator-finder-component.jhc&',
    './ui/inline-select-component.jhc&',
    './ui/loading-animation-component.hc&',
    './ui/markdown-component.jh&',
    './metric-component.jh&',
    './objective/objective-component.jh&',
    './percentage-overview-component.jhc&',
    './plot-2d-component.jhc&',
    './provider-component.jh&',
    './service-component.jh&',
    // TODO: needs a rewrite or remove
    './service-metric-component.jh&',
    './ui/show-hide-component.jhc&',
    './ui/steps-component.jhc&',
    './summary-component.jh&',
    './ui/tabs-component.jhc&',
    './ui/tooltip-component.hc&',
    './llm/llm-api-settings-component.jh&',
]

function parseComponentSpec(componentSpec) {
    const lastDot = componentSpec.lastIndexOf('.')
    if (lastDot === -1) {
        throw new Error(`Invalid componentSpec: ${componentSpec}`)
    }
    const flags = componentSpec.slice(lastDot + 1).trim().toLowerCase()
    if (flags.length <= 1) {
        throw new SyntaxError(`Empty flags: ${componentSpec} => '${flags}'`)
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

    return {
        name,
        relativeUrlBase,
        isAsync: flags.includes('&'),
        hasJs: flags.includes('j'),
        hasHtml: flags.includes('h'),
        hasCss: flags.includes('c'),
    }
}

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 */
export async function registerAllComponents(app) {
    await Promise.all(componentSpecifications.map(async (componentSpec) => {
        const { name, isAsync, relativeUrlBase, hasHtml, hasJs, hasCss } = parseComponentSpec(componentSpec)
        const baseUrlStr = import.meta.resolve(relativeUrlBase)
        const urlStrs = getUrlStrs(baseUrlStr, hasHtml, hasJs, hasCss)

        app.component(name, await componentDefinition(isAsync, urlStrs))
    }))
}
