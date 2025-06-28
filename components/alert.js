import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { entity2symbolNorm, percL10n } from '../lib/fmt.js'
import { Entity } from '../lib/entity.js'
import { toFixed } from '../lib/math.js'
import { inRange, isDef, isInstance, isObj } from '../lib/validation.js'
import { Objective } from './objective.js'

export class Alert extends Entity {
    /** Alert burn rate: the rate above which the error budget is consumed */
    burnRate = config.alert.burnRate.default
    /** Long window alert = percentage of the SLO window */
    longWindowPerc = config.alert.longWindowPerc.default
    /** Short window alert = the fraction of the long window */
    shortWindowDivider = config.alert.shortWindowDivider.default
    /** Show the short window alert */
    useShortWindow = false
    /** The objective this alert is attached to */
    objective = null

    constructor(objective, state) {
        super()
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`Expected an instance of Objective. Got ${objective}`)
        }

        this.objective = objective

        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = {
            burnRate: this.burnRate,
            longWindowPerc: this.longWindowPerc,
        }

        if (this.useShortWindow) {
            ret.shortWindowDivider = this.shortWindowDivider
        }

        return ret
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const {
            burnRate,
            longWindowPerc,
            shortWindowDivider,
        } = newState

        if (isDef(burnRate)) {
            if (!inRange(burnRate, config.alert.burnRate.min, config.alert.burnRate.max)) {
                throw new Error(`Invalid burnRage: ${burnRate} (${typeof burnRate})`)
            }
            this.burnRate = burnRate
        }

        if (isDef(longWindowPerc)) {
            if (!inRange(longWindowPerc, config.alert.longWindowPerc.min, config.alert.longWindowPerc.max)) {
                throw new Error(`Invalid longWindowPerc: ${longWindowPerc} (${typeof longWindowPerc})`)
            }
            this.longWindowPerc = longWindowPerc
        }

        if (isDef(shortWindowDivider)) {
            if (
                !inRange(shortWindowDivider, config.alert.shortWindowDivider.min, config.alert.shortWindowDivider.max)
            ) {
                throw new Error(`Invalid shortWindowDivider: ${shortWindowDivider} (${typeof shortWindowDivider})`)
            }
            this.useShortWindow = true
            this.shortWindowDivider = shortWindowDivider
        } else {
            this.useShortWindow = false
        }
    }

    get shortWindowPerc() {
        return toFixed(this.longWindowPerc / this.shortWindowDivider)
    }

    /** If nothing is done to stop the failures, there'll be burnRate times more errors by the end of the SLO window */
    get sloWindowBudgetBurn() {
        const { sec } = this.objective.window
        const burnedEventAtThisRate = Math.ceil(this.objective.badEventCount * this.burnRate)
        const eventCount = Math.min(this.objective.validEventCount, burnedEventAtThisRate)
        return new FailureWindow(this.objective.indicator, sec, eventCount)
    }

    /** Burn the entire error budget at the given burnRate */
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
