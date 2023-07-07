import { toFixed } from "./util.js"

export function percent(x, total) {
    return x * total / 100
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