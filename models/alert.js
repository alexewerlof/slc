import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { entity2symbolNorm, percL10n } from '../lib/fmt.js'
import { toFixed } from '../lib/math.js'
import { inRange, isInstance, isNum, isObj } from '../lib/validation.js'
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
        if (!isInstance(objective, Objective)) {
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

    save() {
        const ret = {
            burnRate: this.burnRate,
            longWindowPerc: this.longWindowPerc,
        }

        if (this.useShortWindow) {
            ret.shortWindowDivider = this.shortWindowDivider
        }

        return ret
    }

    static load(data, objective) {
        if (!isObj(data)) {
            throw new TypeError(`Alert.load(): Expected a data object. Got ${data}`)
        }
        const alert = new Alert(objective)

        if (inRange(data.burnRate, config.burnRate.min, config.burnRate.max)) {
            alert.burnRate = data.burnRate
        } else {
            alert.burnRate = config.burnRate.default
        }

        if (inRange(data.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
            alert.longWindowPerc = data.longWindowPerc
        } else {
            alert.longWindowPerc = config.longWindowPerc.default
        }

        if (inRange(data.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
            alert.shortWindowDivider = data.shortWindowDivider
            alert.useShortWindow = true
        } else {
            alert.shortWindowDivider = config.shortWindowDivider.default
            alert.useShortWindow = false
        }

        return alert
    }

    get formula() {
        const ret = this.objective.formula.clone()
        ret.pop()

        ret.addExpr(this.longFailureWindow.humanSec, 'alert-error-budget-perc')
        ret.addSpace()

        ret.addPunct(entity2symbolNorm('le'))
        ret.addSpace()
        ret.addExpr(percL10n(this.objective.target), 'slo-int-input')

        if (!this.useShortWindow) {
            return ret
        }

        ret.addBreak()
        ret.addPunct('&&')
        ret.addBreak()

        ret.merge(this.objective.formula)
        ret.pop()

        ret.addExpr(this.shortFailureWindow.humanSec, 'alert-short-window-divider-input')
        ret.addSpace()

        ret.addPunct(entity2symbolNorm('le'))
        ret.addSpace()
        ret.addExpr(percL10n(this.objective.target), 'slo-int-input')

        return ret
    }

    toString() {
        return `${percL10n(this.longWindowPerc)} at ${this.burnRate}x`
    }
}
