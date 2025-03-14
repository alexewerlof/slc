import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { toFixed } from '../lib/math.js'
import { isInstance } from '../lib/validation.js'
import { Objective } from './objective.js'

export class Alert {
    // Alert burn rate: the rate at which the error budget is consumed
    burnRate = config.burnRate.default
    // Long window alert = percentage of the SLO windo
    longWindowPerc = config.longWindowPerc.default
    // Short window alert = the fraction of the long windo
    shortWindowDivider = config.shortWindowDivider.default
    // Show the short window alert
    useShortWindow = false
    // As a percentage of the error budget
    constructor(objective) {
        if(!isInstance(objective, Objective)) {
            throw new TypeError(`Expected an instance of Objective. Got ${objective}`)
        }
        this.objective = objective
    }
    get shortWindowPerc() {
        return toFixed(this.longWindowPerc / this.shortWindowDivider)
    }
    // If nothing is done to stop the failures, there'll be burnRate times more errors by the end of the SLO window
    get sloWindowBudgetBurn() {
        const { sec } = this.objective.window
        const burnedEventAtThisRate = Math.ceil(this.objective.badEventCount * this.burnRate)
        const eventCount = Math.min(this.objective.validEventCount, burnedEventAtThisRate)
        return new FailureWindow(this.objective.indicator, sec, eventCount)
    }
    // Burn the entire error budget at the given burnRate
    get errorBudgetBurn() {
        return this.objective.failureWindow.shrinkSec(100 / this.burnRate)
    }
    get longFailureWindow() {
        return this.errorBudgetBurn.shrink(this.longWindowPerc)
    }
    get shortFailureWindow() {
        return this.errorBudgetBurn.shrink(this.shortWindowPerc)
    }
    get alertTTRWindow() {
        return this.errorBudgetBurn.shrink(100 - this.longWindowPerc)
    }

    toJSON() {
        const ret = {
            burnRate: this.burnRate,
            longWindowPerc: this.longWindowPerc,
        }

        if (this.useShortWindow) {
            ret.shortWindowDivider = this.shortWindowDivider
        }

        return ret
    }
}