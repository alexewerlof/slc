/*
 * The app was deployed long before updating the url structure.
 * For the old links to work in the new app, this file contains
 * conversion functions.
 */

import { getSearchParams, parseParamValue } from './search-params.js'
import { isNum } from './validation.js'

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

    const unitNumber = parseParamValue(Number, ret.unit)
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

export function convertV0toV3(state) {
    const {
        title,
        description,
        metricName,
        // valid,
        slo,
        windowDays,
        timeslice,
        eventUnit,
        estimatedValidEvents,
        // badEventCost,
        // badEventCurrency,
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    } = state

    const alert = {
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    }

    const objective = {
        target: slo,
        windowDays,
        alerts: [alert],
    }

    const indicator = {
        displayName: title,
        description,
        metricName,
        expectedDailyEvents: Math.ceil(estimatedValidEvents / windowDays),
        objectives: [objective],
    }

    if (isNum(timeslice) && timeslice > 0) {
        indicator.timeslice = timeslice
    } else {
        indicator.eventUnit = eventUnit
    }

    return {
        urlVer: 3,
        state: {
            indicators: [indicator],
        },
    }
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
    expectedTotalEvents: Number,
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

export function convertV1toV3(state) {
    const {
        title,
        description,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
        lowerThreshold,
        upperThreshold,
        eventUnit,
        slo,
        windowDays,
        expectedTotalEvents,
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    } = state

    const alert = {
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    }

    const objective = {
        target: slo,
        lowerThreshold,
        upperThreshold,
        windowDays,
        alerts: [alert],
    }

    const indicator = {
        displayName: title,
        description,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
        expectedDailyEvents: expectedTotalEvents / windowDays,
        objectives: [objective],
    }

    if (isNum(eventUnit) && eventUnit > 0) {
        indicator.timeslice = eventUnit
        delete indicator.eventUnit
    } else {
        indicator.eventUnit = eventUnit
    }

    return {
        urlVer: 3,
        state: {
            indicators: [indicator],
        },
    }
}

const v2descriptor = {
    urlVer: Number,
    title: String,
    description: String,
    metricName: String,
    metricUnit: String,
    lowerBound: String,
    upperBound: String,
    lowerThreshold: Number,
    upperThreshold: Number,
    timeslice: Number,
    eventUnit: String,
    slo: Number,
    windowDays: Number,
    estimatedValidEvents: Number,
    burnRate: Number,
    longWindowPerc: Number,
    shortWindowDivider: Number,
}

export function parseUrlV2(url) {
    return getSearchParams(v2descriptor, url)
}

export function convertV2toV3(state) {
    const {
        title,
        description,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
        lowerThreshold,
        upperThreshold,
        eventUnit,
        timeslice,
        slo,
        windowDays,
        estimatedValidEvents,
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    } = state

    const alert = {
        burnRate,
        longWindowPerc,
        shortWindowDivider,
    }

    const objective = {
        target: slo,
        lowerThreshold,
        upperThreshold,
        windowDays,
        alerts: [alert],
    }

    const indicator = {
        displayName: title,
        description,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
        expectedDailyEvents: Math.ceil(estimatedValidEvents / windowDays),
        objectives: [objective],
    }

    if (isNum(timeslice) && timeslice > 0) {
        indicator.timeslice = timeslice
    } else {
        indicator.eventUnit = eventUnit
    }

    return {
        urlVer: 3,
        state: {
            indicators: [indicator],
        },
    }
}

const v3descriptor = {
    urlVer: Number,
    state: Object,
}

export function parseUrlV3(url) {
    return getSearchParams(v3descriptor, url)
}
