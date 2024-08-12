import { getSearchParams, setSearchParams } from './search-params.js'

const descriptor = {
    title: String,
    description: String,
    unit: Number,
    good: String,
    lowerBound: String,
    upperBound: String,
    lowerThreshold: Number,
    upperThreshold: Number,
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

export function urlToState(urlStr) {
    return getSearchParams(descriptor, new URL(urlStr))
}

export function stateToUrl(url, state) {
    return setSearchParams(descriptor, url, state)
}