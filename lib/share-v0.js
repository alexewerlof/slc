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

export function getSearchParamsV0(url) {
    const ret = getSearchParams(v0Descriptor, url)

    const unitNumber = convertParam(Number, ret.unit)
    if (isNum(unitNumber)) {
        ret.timeslice = unitNumber
    } else {
        if (ret.valid) {
            ret.valid += ' ' + ret.unit
        } else {
            ret.valid = ret.unit
        }
    }
    delete ret.unit

    return ret
}