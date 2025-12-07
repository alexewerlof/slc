import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { entity2symbolNorm, percL10n } from '../lib/fmt.js'
import { Entity } from '../lib/entity.js'
import { clamp, percent, toFixed } from '../lib/math.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { daysToSeconds, secondsToDays } from '../lib/time.js'
import { inRange, isArr, isDef, isInstance } from '../lib/validation.js'
import { Window } from '../lib/window.js'
import { Alert } from './alert.js'
import { Formula } from './ui/formula.js'
import { Indicator } from './indicator.js'
import { Lint } from './lint.js'

export class Objective extends Entity {
    /** The SLO percentage. It is also read/written by the sloInt and sloFrac computed  properties */
    target = config.slo.default

    /** Lower bound threshold */
    _lowerThreshold = config.lowerThreshold.default

    /** Upper bound threshold */
    _upperThreshold = config.upperThreshold.default

    /** {@type {Alert[]}} List of alerts attached to this SLO */
    alerts = new SelectableArray(Alert, this)

    /** The indicator this SLO is attached to */
    indicator = null

    constructor(indicator, state) {
        super('o', false)
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
        }

        this.indicator = indicator

        this.window = new Window(indicator, daysToSeconds(config.windowDays.default))

        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = super.state

        ret.target = this.target
        ret.windowDays = this.windowDays

        if (this.indicator.lowerBound) {
            ret.lowerThreshold = this.lowerThreshold
        }
        if (this.indicator.upperBound) {
            ret.upperThreshold = this.upperThreshold
        }
        if (this.alerts.length) {
            ret.alerts = this.alerts.map((alert) => alert.state)
        }

        return ret
    }

    set state(newState) {
        super.state = newState

        const { target, windowDays, lowerThreshold, upperThreshold, alerts } = newState

        if (isDef(target)) {
            if (!inRange(target, config.slo.min, config.slo.max)) {
                throw new Error(`Invalid target: ${target} (${typeof target})`)
            }
            this.target = target
        }

        if (isDef(windowDays)) {
            if (!inRange(windowDays, config.windowDays.min, config.windowDays.max)) {
                throw new Error(`Invalid windowDays: ${windowDays} (${typeof windowDays})`)
            }
            this.windowDays = windowDays
        }

        if (this.indicator.lowerBound) {
            if (!isDef(lowerThreshold)) {
                throw new Error('Indicator is lowerBound but lowerThreshold is not defined')
            }
            if (!inRange(lowerThreshold, config.lowerThreshold.min, config.lowerThreshold.max)) {
                throw new Error(`Invalid lowerThreshold: ${lowerThreshold} (${typeof lowerThreshold})`)
            }
            this.lowerThreshold = lowerThreshold
        }

        if (this.indicator.upperBound) {
            if (!isDef(upperThreshold)) {
                throw new Error('Indicator is upperBound but upperThreshold is not defined')
            }
            if (!inRange(upperThreshold, config.upperThreshold.min, config.upperThreshold.max)) {
                throw new Error(`Invalid upperThreshold: ${upperThreshold} (${typeof upperThreshold})`)
            }
            this.upperThreshold = upperThreshold
        }

        if (isDef(alerts)) {
            if (!isArr(alerts)) {
                throw new TypeError(`Invalid alerts array: ${alerts} (${typeof alerts})`)
            }
            this.alerts.state = alerts
        }
    }

    get lowerThreshold() {
        return this._lowerThreshold
    }

    set lowerThreshold(value) {
        const { min, max } = config.lowerThreshold
        this._lowerThreshold = inRange(value, min, Math.min(max, this.upperThreshold))
            ? value
            : config.lowerThreshold.default
    }

    get upperThreshold() {
        return this._upperThreshold
    }

    set upperThreshold(value) {
        const { min, max } = config.upperThreshold
        this._upperThreshold = inRange(value, Math.max(min, this.lowerThreshold), max)
            ? value
            : config.upperThreshold.default
    }

    get lowerThresholdMax() {
        return this.indicator.upperBound ? this.upperThreshold : config.lowerThreshold.max
    }

    get upperThresholdMin() {
        return this.indicator.lowerBound ? this.lowerThreshold : config.upperThreshold.min
    }

    get targetInt() {
        return Math.floor(this.target)
    }

    set targetInt(newIntStr) {
        const newInt = Number(newIntStr)
        const currTargetFrac = this.target % 1
        this.target = toFixed(newInt + currTargetFrac)
    }

    get targetFrac() {
        return toFixed(this.target % 1)
    }

    set targetFrac(newFracStr) {
        const newFrac = Number(newFracStr)
        const currTargetInt = Math.floor(this.target)
        this.target = toFixed(currTargetInt + newFrac)
    }

    get errorBudget() {
        return toFixed(100 - this.target)
    }

    get windowDays() {
        return secondsToDays(this.window.sec)
    }

    /** The length of the SLO window in days */
    set windowDays(days) {
        this.window.sec = daysToSeconds(days)
    }

    get expectedTotalEvents() {
        return Math.round(this.indicator.expectedDailyEvents * this.windowDays) || config.expectedTotalEvents.min
    }

    set expectedTotalEvents(value) {
        this.indicator.expectedDailyEvents = Math.round(value / this.windowDays)
    }

    /** Allows fine tuning the target by adding or removing a small amount */
    changeTarget(amount) {
        this.target = clamp(toFixed(this.target + amount), config.slo.min, config.slo.max)
    }

    get validEventCount() {
        if (this.indicator.isTimeBased) {
            return this.window.countTimeslices
        } else {
            return this.expectedTotalEvents
        }
    }

    get goodEventCount() {
        return Math.floor(percent(this.target, this.validEventCount))
    }

    get badEventCount() {
        return this.validEventCount - this.goodEventCount
    }

    changeErrorBudget(amount) {
        // Event based
        const newBadEventCount = clamp(this.badEventCount + amount, 1, this.validEventCount)
        const newGoodEventCount = this.validEventCount - newBadEventCount
        const newSLO = toFixed((newGoodEventCount / this.validEventCount) * 100)
        this.target = clamp(newSLO, config.slo.min, config.slo.max)
    }

    get failureWindow() {
        const { sec } = this.window
        return new FailureWindow(this.indicator, sec, this.badEventCount)
    }

    get formula() {
        const ret = new Formula()

        ret.addFunct('Percentage_of')
        ret.addSpace()
        ret.addExpr(this.indicator.eventUnitNorm, 'sli-event-unit')
        ret.addSpace()
        ret.addFunct('where')
        ret.addSpace()

        if (this.indicator.lowerBound) {
            ret.addExpr(this.lowerThreshold, 'lower-threshold-input')
            ret.addExpr(this.indicator.metricUnit, 'sli-metric-unit')
            ret.addSpace()
            ret.addPunct(entity2symbolNorm(this.indicator.lowerBound), 'lower-bound-type')
            ret.addSpace()
        }

        ret.addExpr(this.indicator.metricName, 'sli-metric-name')

        if (this.indicator.upperBound) {
            ret.addSpace()
            ret.addPunct(entity2symbolNorm(this.indicator.upperBound), 'upper-bound-type')
            ret.addSpace()
            ret.addExpr(this.upperThreshold, 'upper-threshold-input')
            ret.addExpr(this.indicator.metricUnit, 'sli-metric-unit')
        }

        ret.addSpace()
        ret.addFunct('during')
        ret.addSpace()

        ret.addExpr(this.window.humanSec, 'slo-window-unit-multiplier')

        return ret
    }

    toString() {
        return `${percL10n(this.target)} over ${this.windowDays} days`
    }

    get lint() {
        const lint = new Lint()

        if (this.target < 70) {
            lint.info(
                'This is an unusually low target.',
                `Typically the SLO target is above ${percL10n(90)} with some rare exceptions.`,
                'Please check the Error budget for implications on your chosen target.',
            )
        } else if (this.target > 99.9) {
            lint.info(
                'Just be mindful of the price tag for this high target.',
                'Everyone wants the highest possible number but not everyone is willing to pay',
                '[the price](https://blog.alexewerlof.com/p/10x9).',
            )
        }

        if (this.indicator.isRanged && this.upperThreshold <= this.lowerThreshold) {
            lint.error('The upper threshold must be greater than the lower threshold.')
        }

        return lint
    }
}
