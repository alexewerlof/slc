import { config } from '../config.js'
import { inRange, isStr, isObj, inRangePosInt, isDef } from './validation.js'

export function defaultState() {
    return {
        // The title of the SLI
        title: config.title.default,
        // The description of the SLI
        description: config.description.default,
        // unit of SLI or number of seconds in a time slot
        unit: config.unit.default,
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

    // Unit is a bit special. It can be the event name or a time slot length in seconds
    if (isStr(state.unit) || inRangePosInt(state.unit, config.timeSlot.min, config.timeSlot.max)) {
        ret.unit = state.unit
        ret.unit = state.unit
    }

    if (isStr(state.good)) {
        ret.good = state.good
    }

    if (isStr(state.valid)) {
        ret.valid = state.valid
    }

    if (isDef(state.slo) && inRange(state.slo, config.slo.min, config.slo.max)) {
        ret.slo = state.slo
    }

    if (isDef(state.windowDays) && inRangePosInt(state.windowDays, config.windowDays.min, config.windowDays.max)) {
        ret.windowDays = state.windowDays
    }

    if (isDef(state.errorBudgetValidExample) && inRangePosInt(state.errorBudgetValidExample, config.errorBudgetValidExample.min, config.errorBudgetValidExample.max)) {
        ret.errorBudgetValidExample = state.errorBudgetValidExample
    }

    if (isDef(state.burnRate) && inRange(state.burnRate, config.burnRate.min, config.burnRate.max)) {
        ret.burnRate = state.burnRate
    }

    if (isDef(state.longWindowPerc) && inRange(state.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
        ret.longWindowPerc = state.longWindowPerc
    }

    if (isDef(state.shortWindowDivider) && inRange(state.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
        ret.shortWindowDivider = state.shortWindowDivider
    }

    return ret
}
