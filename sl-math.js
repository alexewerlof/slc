import { toFixed } from "./util.js"

export function percent(p, total) {
    if (!Number.isFinite(p)) {
        throw new Error(`percent(): ${ p } is not a finite number (type: ${ typeof p })`)
    }
    if (p < 0 || p > 100) {
        throw new RangeError(`percent(): ${ p } is not a number 0-100`)
    }
    if (!Number.isFinite(total)) {
        throw new Error(`percent(): total is not a finite number: ${ total } (type: ${ typeof total })`)
    }
    return p * total / 100
}

export function percentToRatio(x) {
    return toFixed(x / 100, 5)
}

/**
 * Calculates the percentage of a given time window in seconds
 * @param {number} perc 0-100
 * @param {number} timeWindowSec the window length in seconds
 * @returns the percentage of the time window in seconds
 */
export function windowPerc(perc, timeWindowSec) {
    const ret = percent(perc, timeWindowSec)
    if (ret < 1) {
        return toFixed(ret, 3)
    } if (ret < 10) {
        return toFixed(ret, 1)
    }

    return Math.round(ret)
}

export function errorBudgetTime(sloPerc, sloWindowSec) {
    return windowPerc(errorBudgetPerc(sloPerc), sloWindowSec)
}

export function errorBudgetPerc(sloPerc) {
    return 100 - sloPerc
}

export function errorBudgetEvents(sloPerc, totalEvents) {
    return Math.floor(percent(errorBudgetPerc(sloPerc), totalEvents))
}
