import { config } from '../config.js'
import { inRange, isStr, isObj, inRangePosInt } from './validation.js'

export function defaultState() {
    return {
        // The title of the SLI
        title: config.title.default,
        // The description of the SLI
        description: config.description.default,
        // unit of SLI
        unit: config.unit.default,
// For time-based SLIs, this is the number of seconds in a time slot
        timeSlot: config.timeSlot.default,
        // definition of good events or good time slots
        good: config.good.default,
        // definition of valid events or valid time slots
        valid: config.valid.default,
        // The SLO percentage. It is also read/written by the sloInt and sloFrac computed properties
        slo: config.slo.default,
        // The length of the SLO window in days
        windowDays: config.windowDays.default,
        // For event based error budgets, this number holds the total valid events so we can compute the ammount of allowed failures
        errorBudgetValidExample: config.errorBudgetValidExample.default,
        // Alert burn rate: the rate at which the error budget is consumed
        burnRate: config.burnRate.default,
        // Long window alert: percentage of the SLO window
        longWindowPerc: config.longWindowPerc.default,
        // Short window alert: the fraction of the long window
        shortWindowDivider: config.shortWindowDivider.default,
    }
}

export function encodeState(state) {
    if (!isObj(state)) {
        throw new Error(`"state" must be an object. Got ${state}`)
    }
    const jsonString = JSON.stringify(state)
    return btoa(jsonString)
}

export function decodeState(base64String) {
    if (!isStr(base64String)) {
        throw new Error(`"param" must be a string. Got ${base64String}`)
    }
    const jsonString = atob(base64String)
    return JSON.parse(jsonString)
}

export function sanitizeState(state) {
    const ret = defaultState()

    if (isStr(state.title)) {
        ret.title = state.title
    }

    if (isStr(state.description)) {
        ret.description = state.description
    }

    if (isStr(state.unit)) {
        ret.unit = state.unit
    }

    if (inRangePosInt(state.timeSlot, config.timeSlot.min, config.timeSlot.max)) {
        ret.timeSlot = state.timeSlot
    }

    if (isStr(state.good)) {
        ret.good = state.good
    }

    if (isStr(state.valid)) {
        ret.valid = state.valid
    }

    if (inRange(state.slo, config.slo.min, config.slo.max)) {
        ret.slo = state.slo
    }

    if (inRangePosInt(state.windowDays, config.windowDays.min, config.windowDays.max)) {
        ret.windowDays = state.windowDays
    }

    if (inRangePosInt(state.errorBudgetValidExample, config.errorBudgetValidExample.min, config.errorBudgetValidExample.max)) {
        ret.errorBudgetValidExample = state.errorBudgetValidExample
    }

    if (inRange(state.burnRate, config.burnRate.min, config.burnRate.max)) {
        ret.burnRate = state.burnRate
    }

    if (inRange(state.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
        ret.longWindowPerc = state.longWindowPerc
    }

    if (inRange(state.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
        ret.shortWindowDivider = state.shortWindowDivider
    }

    return ret
}
