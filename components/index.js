import { addComponent } from '../lib/fetch-template.js'
import { isStr } from '../lib/validation.js'

const componentDescriptors = [
    'JHC:./alert-chart-component',
    'JH:./alert-component',
    'JHC:./announcement-component',
    'JHC:./axis-component',
    'JHC:./burn-event-component',
    'JHC:./burn-rate-component',
    'JH:./calculator-component',
    'JHC:./chat-thread-component',
    'JHC:./code-block-component',
    'JH:./condition-component',
    'JH:./consumer-component',
    'JH:./consumption-component',
    'JHC:./cookie-popup-component',
    'JHC:./error-budget-component',
    'JH:./event-component',
    'SJH:./ext-link',
    'JH:./failure-component',
    'JHC:./faq-component',
    'JHC:./feedback-blob-component',
    'JHC:./footer-component',
    'JH:./formula-component',
    'JHC:./header-component',
    'SJHC:./help-component',
    'JHC:./hero-component',
    'JH:./indicator-component',
    'JHC:./inline-select-component',
    'HC:./loading-animation-component',
    'JH:./metric-component',
    'JH:./objective-component',
    'JHC:./percentage-overview-component',
    'JHC:./plot-2d-component',
    'JH:./provider-component',
    'JH:./risk-component',
    'JH:./service-component',
    'JH:./service-metric-component',
    'JHC:./show-hide-component',
    'JHC:./steps-component',
    'JH:./summary-component',
    'JHC:./tabs-component',
    'HC:./tooltip-component',
]

function getUrlStrs(flags, relativeUrlBase) {
    if (!isStr(flags)) {
        throw new Error(`Invalid flags: ${flags}`)
    }
    if (!isStr(relativeUrlBase)) {
        throw new Error(`Invalid relativeUrlBase: ${relativeUrlBase}`)
    }

    flags = flags.toUpperCase()

    const hasJs = flags.includes('J')
    const hasHtml = flags.includes('H')
    const hasCss = flags.includes('C')

    if (!hasJs && !hasHtml && !hasCss) {
        throw new Error(`Invalid flags: ${flags}`)
    }

    const baseUrlStr = import.meta.resolve(relativeUrlBase)
    return {
        loadSync: flags.includes('S'),
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
    await Promise.all(componentDescriptors.map(async (descriptor) => {
        const [flags, relativeUrlBase] = descriptor.split(':')
        const { loadSync, jsUrlStr, htmlUrlStr, cssUrlStr } = getUrlStrs(flags, relativeUrlBase)
        const name = relativeUrlBase.split('/').pop()
        await addComponent(app, name, loadSync, jsUrlStr, htmlUrlStr, cssUrlStr)
    }))
}
