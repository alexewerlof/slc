import { componentDefinition } from '../lib/component-loader.js'
import { isStrLen } from '../lib/validation.js'

const componentSpecifications = [
    ' AJHC : ./alert/alert-chart-component',
    ' AJH  : ./alert/alert-component',
    ' AJHC : ./ui/announcement-component',
    ' AJHC : ./axis-component',
    ' AJHC : ./alert/burn-event-component',
    ' AJHC : ./alert/burn-rate-component',
    ' AJHC : ./calculator-component',
    ' AJHC : ./chat-thread-component',
    ' AJHC : ./ui/code-block-component',
    ' AJH  : ./condition-component',
    ' AJH  : ./consumer-component',
    ' AJH  : ./consumption-component',
    ' AJHC : ./ui/cookie-popup-component',
    ' AJHC : ./ui/dialog-component',
    ' AJHC : ./objective/error-budget-component',
    ' AJH  : ./event-component',
    '  JH  : ./ext-link',
    ' AJH  : ./failure-component',
    ' AJHC : ./faq-component',
    ' AJHC : ./feedback-blob-component',
    ' AJHC : ./footer-component',
    ' AJH  : ./formula-component',
    ' AJHC : ./ui/header-component',
    '  JHC : ./ui/help-component',
    ' AJHC : ./ui/hero-component',
    ' AJH  : ./indicator/indicator-component',
    ' AJHC : ./indicator/indicator-finder-component',
    ' AJHC : ./ui/inline-select-component',
    ' A HC : ./ui/loading-animation-component',
    ' AJH  : ./metric-component',
    ' AJH  : ./objective/objective-component',
    ' AJHC : ./percentage-overview-component',
    ' AJHC : ./plot-2d-component',
    ' AJH  : ./provider-component',
    ' AJH  : ./risk-component',
    ' AJH  : ./service-component',
    ' AJH  : ./service-metric-component',
    ' AJHC : ./ui/show-hide-component',
    ' AJHC : ./ui/steps-component',
    ' AJH  : ./summary-component',
    ' AJHC : ./ui/tabs-component',
    ' A HC : ./ui/tooltip-component',
]

function parseComponentSpec(componentSpec) {
    const [flags, relativeUrlBase] = componentSpec.split(':').map((s) => s.trim())
    if (!isStrLen(flags, 1)) {
        throw new Error(`Invalid flags: ${flags}`)
    }
    if (!isStrLen(relativeUrlBase, 5)) {
        throw new Error(`Invalid relativeUrlBase: ${relativeUrlBase}`)
    }
    const name = relativeUrlBase.split('/').pop()
    const nameRegex = /^[a-zA-Z0-9-]+$/
    if (!isStrLen(name, 3) || !nameRegex.test(name)) {
        throw new Error(`Invalid component name: ${name}`)
    }

    const flagsUpperCase = flags.toUpperCase()

    return {
        name,
        relativeUrlBase,
        isAsync: flagsUpperCase.includes('A'),
        hasJs: flagsUpperCase.includes('J'),
        hasHtml: flagsUpperCase.includes('H'),
        hasCss: flagsUpperCase.includes('C'),
    }
}

function getUrlStrs(relativeUrlBase, hasJs, hasHtml, hasCss) {
    if (!hasJs && !hasHtml && !hasCss) {
        throw new Error(`Flags don't specify HTML, CSS, or JS: ${flags}`)
    }

    const baseUrlStr = import.meta.resolve(relativeUrlBase)
    return {
        jsUrlStr: hasJs ? baseUrlStr + '.js' : undefined,
        htmlUrlStr: hasHtml ? baseUrlStr + '.html' : undefined,
        cssUrlStr: hasCss ? baseUrlStr + '.css' : undefined,
    }
}

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 */
export async function registerAllComponents(app) {
    await Promise.all(componentSpecifications.map(async (componentSpec) => {
        const { name, isAsync, relativeUrlBase, hasJs, hasHtml, hasCss } = parseComponentSpec(componentSpec)
        const { jsUrlStr, htmlUrlStr, cssUrlStr } = getUrlStrs(relativeUrlBase, hasJs, hasHtml, hasCss)

        app.component(name, await componentDefinition(isAsync, jsUrlStr, htmlUrlStr, cssUrlStr))
    }))
}
