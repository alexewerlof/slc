import { isStr } from "./validation.js"

function num(x) {
    if (!isStr(x)) {
        return undefined
    }
    try {
        return Number(x)
    } catch (e) {
        return undefined
    }
}

export function urlToState(urlStr) {
    const url = new URL(urlStr)

    return {
        title: url.searchParams.get('title'),
        description: url.searchParams.get('description'),
        // Can be a number or string
        unit: num(url.searchParams.get('unit')) || url.searchParams.get('unit'),
        good: url.searchParams.get('good'),
        valid: url.searchParams.get('valid'),
        slo: num(url.searchParams.get('slo')),
        windowDays: num(url.searchParams.get('windowDays')),
        errorBudgetValidExample: num(url.searchParams.get('errorBudgetValidExample')),
        burnRate: num(url.searchParams.get('burnRate')),
        longWindowPerc: num(url.searchParams.get('longWindowPerc')),
        shortWindowDivider: num(url.searchParams.get('shortWindowDivider')),
    }
}

export function stateToUrl(urlBaseStr, state) {
    const url = new URL(urlBaseStr)

    // A few fields may be empty strings, so let's keep the URL short
    if (state.title) {
        url.searchParams.set('title', state.title)
    }
    if (state.description) {
        url.searchParams.set('description', state.description)
    }
    url.searchParams.set('unit', state.unit)
    url.searchParams.set('good', state.good)
    if (state.valid) {
        url.searchParams.set('valid', state.valid)
    }
    url.searchParams.set('slo', state.slo)
    url.searchParams.set('windowDays', state.windowDays)
    url.searchParams.set('errorBudgetValidExample', state.errorBudgetValidExample)
    url.searchParams.set('burnRate', state.burnRate)
    url.searchParams.set('longWindowPerc', state.longWindowPerc)
    url.searchParams.set('shortWindowDivider', state.shortWindowDivider)

    return url.toString()
}