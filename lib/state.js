import { config } from '../config.js'
import { inRange, isStr, inRangePosInt } from './validation.js'

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
        // The cost of a bad event
        badEventCost: config.badEventCost.default,
        // The unit of the bad event cost
        badEventCurrency: config.badEventCurrency.default,
        // Alert burn rate: the rate at which the error budget is consumed
        burnRate: config.burnRate.default,
        // Long window alert: percentage of the SLO window
        longWindowPerc: config.longWindowPerc.default,
        // Short window alert: the fraction of the long window
        shortWindowDivider: config.shortWindowDivider.default,
    }
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

    if (inRange(state.badEventCost, config.badEventCost.min, config.badEventCost.max)) {
        ret.badEventCost = state.badEventCost
    }

    if (isStr(state.badEventCurrency)) {
        ret.badEventCurrency = state.badEventCurrency
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
