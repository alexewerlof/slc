/*
 * The app was deployed long before updating the url structure.
 * For the old links to work in the new app, this file contains
 * conversion functions.
 */

import { convertParam, getSearchParams } from "./search-params.js"
import { isNum } from "./validation.js"

const v0Descriptor = {
    title: String,
    description: String,
    unit: String,
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

export function parseUrlV0(url) {
    const ret = getSearchParams(v0Descriptor, url)

    const unitNumber = convertParam(Number, ret.unit)
    if (isNum(unitNumber)) {
        ret.timeslice = unitNumber
    } else {
        ret.eventUnit = ret.valid ? `${ret.valid} ${ret.unit}` : ret.unit
    }
    delete ret.valid
    delete ret.unit

    ret.metricName = ret.good
    delete ret.good

    return ret
}

const v1descriptor = {
    urlVer: Number,
    title: String,
    description: String,
    good: String,
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

export function parseUrlV1(url) {
    const ret = getSearchParams(v1descriptor, url)
    ret.metricName = ret.good
    delete ret.good
    ret.eventUnit = ret.valid
    delete ret.valid
    return ret
}