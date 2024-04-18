import { isStr } from "./validation.js"
import { getSearchParams, setSearchParams } from './search-params.js'

const descriptor = {
    title: String,
    description: String,
    unit: Number,
    good: String,
    valid: String,
    slo: Number,
    windowDays: Number,
    estimatedValidEvents: Number,
    badEventCost: Number,
    badEventCurrency: String,
    burnRate: Number,
    longWindowPerc: Number,
    shortWindowDivider: Number,
}

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
        estimatedValidEvents: num(url.searchParams.get('estimatedValidEvents')),
        badEventCost: num(url.searchParams.get('badEventCost')),
        badEventCurrency: url.searchParams.get('badEventCurrency'),
        burnRate: num(url.searchParams.get('burnRate')),
        longWindowPerc: num(url.searchParams.get('longWindowPerc')),
        shortWindowDivider: num(url.searchParams.get('shortWindowDivider')),
    }
}

export function stateToUrl(url, state) {
    return setSearchParams(descriptor, url, state)
}