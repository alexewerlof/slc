import { config } from '../config.js'
import { convertParam, getSearchParams, setSearchParams } from './search-params.js'
import { parseUrlV0, parseUrlV1 } from './share-legacy.js'
import { isStr } from './validation.js'

const descriptor = {
    urlVer: Number,
    title: String,
    description: String,
    metricName: String,
    metricUnit: String,
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
    if (!isStr(urlStr)) {
        throw new TypeError(`urlToState(): urlStr must be a string. Got ${urlStr}`)
    }
    const u = new URL(urlStr)
    switch (convertParam(Number, u.searchParams.get('urlVer'))) {
        case undefined:
        case 0:
            return parseUrlV0(u)
        case 1:
            return parseUrlV1(u)
        case config.urlVer:
            return getSearchParams(descriptor, u)
    }
}

export function stateToUrl(url, state) {
    return setSearchParams(descriptor, url, state)
}