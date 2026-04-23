import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { entity2symbolNorm, percL10n } from '../lib/fmt.js'
import { Entity } from '../lib/entity.js'
import { clamp, percent, toFixed } from '../lib/math.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { daysToSeconds, secondsToDays } from '../lib/time.js'
import { inRange, isArr, isDef, isInstance } from '../dependencies/jty.js'
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

    /** @type {Indicator | null} The indicator this SLO is attached to */
    indicator = null

    /**
     * Creates a new Objective (SLO) instance.
     * @param {Indicator} indicator The indicator this SLO measures.
     * @param {Object} [state] Optional serialized state to restore.
     */
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

    /**
     * Returns the serialisable state of this Objective.
     * @returns {Object}
     */
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

    /**
     * Restores the Objective from a serialized state object.
     * @param {Object} newState
     */
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

    /**
     * The lower threshold value for the SLI metric.
     * @returns {number}
     */
    get lowerThreshold() {
        return this._lowerThreshold
    }

    /**
     * Sets the lower threshold, clamping to the valid range.
     * @param {number} value
     */
    set lowerThreshold(value) {
        const { min, max } = config.lowerThreshold
        this._lowerThreshold = inRange(value, min, Math.min(max, this.upperThreshold))
            ? value
            : config.lowerThreshold.default
    }

    /**
     * The upper threshold value for the SLI metric.
     * @returns {number}
     */
    get upperThreshold() {
        return this._upperThreshold
    }

    /**
     * Sets the upper threshold, clamping to the valid range.
     * @param {number} value
     */
    set upperThreshold(value) {
        const { min, max } = config.upperThreshold
        this._upperThreshold = inRange(value, Math.max(min, this.lowerThreshold), max)
            ? value
            : config.upperThreshold.default
    }

    /**
     * The maximum allowed value for the lower threshold.
     * @returns {number}
     */
    get lowerThresholdMax() {
        return this.indicator.upperBound ? this.upperThreshold : config.lowerThreshold.max
    }

    /**
     * The minimum allowed value for the upper threshold.
     * @returns {number}
     */
    get upperThresholdMin() {
        return this.indicator.lowerBound ? this.lowerThreshold : config.upperThreshold.min
    }

    /**
     * The integer part of the SLO target percentage.
     * @returns {number}
     */
    get targetInt() {
        return Math.floor(this.target)
    }

    /**
     * Sets the integer part of the SLO target, keeping the fractional part.
     * @param {string|number} newIntStr
     */
    set targetInt(newIntStr) {
        const newInt = Number(newIntStr)
        const currTargetFrac = this.target % 1
        this.target = toFixed(newInt + currTargetFrac)
    }

    /**
     * The fractional part of the SLO target percentage.
     * @returns {number}
     */
    get targetFrac() {
        return toFixed(this.target % 1)
    }

    /**
     * Sets the fractional part of the SLO target, keeping the integer part.
     * @param {string|number} newFracStr
     */
    set targetFrac(newFracStr) {
        const newFrac = Number(newFracStr)
        const currTargetInt = Math.floor(this.target)
        this.target = toFixed(currTargetInt + newFrac)
    }

    /**
     * The error budget as a percentage (100 - target).
     * @returns {number}
     */
    get errorBudget() {
        return toFixed(100 - this.target)
    }

    /**
     * The length of the SLO window in days.
     * @returns {number}
     */
    get windowDays() {
        return secondsToDays(this.window.sec)
    }

    /** The length of the SLO window in days */
    set windowDays(days) {
        this.window.sec = daysToSeconds(days)
    }

    /**
     * The expected total number of valid events in the SLO window.
     * @returns {number}
     */
    get expectedTotalEvents() {
        return Math.round(this.indicator.expectedDailyEvents * this.windowDays) || config.expectedTotalEvents.min
    }

    /**
     * Sets the expected total events by back-computing the daily event rate.
     * @param {number} value
     */
    set expectedTotalEvents(value) {
        this.indicator.expectedDailyEvents = Math.round(value / this.windowDays)
    }

    /**
     * Adjusts the SLO target by a small delta, clamping to the configured range.
     * @param {number} amount The delta to add (positive) or subtract (negative).
     */
    changeTarget(amount) {
        this.target = clamp(toFixed(this.target + amount), config.slo.min, config.slo.max)
    }

    /**
     * The number of valid events (timeslices or total events) in the SLO window.
     * @returns {number}
     */
    get validEventCount() {
        if (this.indicator.isTimeBased) {
            return this.window.countTimeslices
        } else {
            return this.expectedTotalEvents
        }
    }

    /**
     * The number of good events required to meet the SLO target.
     * @returns {number}
     */
    get goodEventCount() {
        return Math.floor(percent(this.target, this.validEventCount))
    }

    /**
     * The maximum number of bad events allowed within the SLO window.
     * @returns {number}
     */
    get badEventCount() {
        return this.validEventCount - this.goodEventCount
    }

    /**
     * Adjusts the SLO target by changing the bad event count by the given delta.
     * @param {number} amount The number of bad events to add (positive) or remove (negative).
     */
    changeErrorBudget(amount) {
        // Event based
        const newBadEventCount = clamp(this.badEventCount + amount, 1, this.validEventCount)
        const newGoodEventCount = this.validEventCount - newBadEventCount
        const newSLO = toFixed((newGoodEventCount / this.validEventCount) * 100)
        this.target = clamp(newSLO, config.slo.min, config.slo.max)
    }

    /**
     * A FailureWindow representing the full error budget for this SLO.
     * @returns {import('../lib/failure-window.js').FailureWindow}
     */
    get failureWindow() {
        const { sec } = this.window
        return new FailureWindow(this.indicator, sec, this.badEventCount)
    }

    /**
     * Builds the SLO formula representation including thresholds and window.
     * @returns {Formula}
     */
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

    /**
     * Returns a human-readable string representation of this SLO.
     * @returns {string}
     */
    toString() {
        return `${percL10n(this.target)} over ${this.windowDays} days`
    }

    /**
     * Returns lint results for this SLO.
     * @returns {Lint}
     */
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
