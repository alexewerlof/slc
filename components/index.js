import { componentDefinition } from '../lib/component-loader.js'
import { isStrLen } from '../lib/validation.js'

const componentSpecifications = [
    ' AJHC : ./alert-chart-component',
    ' AJH  : ./alert-component',
    ' AJHC : ./announcement-component',
    ' AJHC : ./axis-component',
    ' AJHC : ./burn-event-component',
    ' AJHC : ./burn-rate-component',
    ' AJH  : ./calculator-component',
    ' AJHC : ./chat-thread-component',
    ' AJHC : ./code-block-component',
    ' AJH  : ./condition-component',
    ' AJH  : ./consumer-component',
    ' AJH  : ./consumption-component',
    ' AJHC : ./cookie-popup-component',
    ' AJHC : ./dialog-component',
    ' AJHC : ./error-budget-component',
    ' AJH  : ./event-component',
    '  JH  : ./ext-link',
    ' AJH  : ./failure-component',
    ' AJHC : ./faq-component',
    ' AJHC : ./feedback-blob-component',
    ' AJHC : ./footer-component',
    ' AJH  : ./formula-component',
    ' AJHC : ./header-component',
    '  JHC : ./help-component',
    ' AJHC : ./hero-component',
    ' AJH  : ./indicator-component',
    ' AJHC : ./indicator-finger-component',
    ' AJHC : ./inline-select-component',
    ' A HC : ./loading-animation-component',
    ' AJH  : ./metric-component',
    ' AJH  : ./objective-component',
    ' AJHC : ./percentage-overview-component',
    ' AJHC : ./plot-2d-component',
    ' AJH  : ./provider-component',
    ' AJH  : ./risk-component',
    ' AJH  : ./service-component',
    ' AJH  : ./service-metric-component',
    ' AJHC : ./show-hide-component',
    ' AJHC : ./steps-component',
    ' AJH  : ./summary-component',
    ' AJHC : ./tabs-component',
    ' A HC : ./tooltip-component',
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
