import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { entity2symbolNorm, percL10n } from '../lib/fmt.js'
import { clamp, percent, toFixed } from '../lib/math.js'
import { daysToSeconds, secondsToDays } from '../lib/time.js'
import { inRange, isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { Window } from '../lib/window.js'
import { Alert } from './alert.js'
import { Formula } from './formula.js'
import { Indicator } from './indicator.js'

export class Objective {
    // The SLO percentage. It is also read/written by the sloInt and sloFrac computed properties
    target = config.slo.default
    // Lower bound threshold
    _lowerThreshold = config.lowerThreshold.default
    // List of alerts attached to this SLO
    alerts = []
    // Upper bound threshold
    _upperThreshold = config.upperThreshold.default
    constructor(indicator, options) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
        }

        this.indicator = indicator

        this.window = new Window(
            indicator,
            daysToSeconds(config.windowDays.default),
        )

        if (!isDef(options)) {
            return
        }

        if (!isObj(options)) {
            throw new TypeError(`Invalid options object: ${options} ${typeof options}`)
        }

        const {
            target,
            windowDays,
            lowerThreshold,
            upperThreshold,
            alerts,
        } = options

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
                throw new Error(
                    `Invalid upperThreshold: ${upperThreshold} (${typeof upperThreshold})`,
                )
            }
            this.upperThreshold = upperThreshold
        }

        if (isDef(alert)) {
            if (!isArr(alerts)) {
                throw new TypeError(`Invalid alerts array: ${alerts} (${typeof alerts})`)
            }
            for (const alertOptions of alerts) {
                this.addAlert(new Alert(this, alertOptions))
            }
        }
    }

    addAlert(alert) {
        if (!isInstance(alert, Alert)) {
            throw new TypeError(`Objective.addAlert(): Expected an instance of Alert. Got ${alert}`)
        }
        alert.objective = this
        this.alerts.push(alert)
        return alert
    }

    addNewAlert() {
        return this.addAlert(new Alert(this))
    }

    removeAlert(alert) {
        if (!isInstance(alert, Alert)) {
            throw new TypeError(`Objective.removeAlert(): Expected an instance of Alert. Got ${alert}`)
        }
        const idx = this.alerts.indexOf(alert)
        if (idx === -1) {
            throw new RangeError(`Objective.removeAlert(): Alert not found: ${alert}`)
        }
        this.alerts.splice(idx, 1)
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
        const newSLO = toFixed(newGoodEventCount / this.validEventCount * 100)
        this.target = clamp(newSLO, config.slo.min, config.slo.max)
    }

    get failureWindow() {
        const { sec } = this.window
        return new FailureWindow(this.indicator, sec, this.badEventCount)
    }

    save() {
        const ret = {
            target: this.target,
            windowDays: this.windowDays,
        }
        if (this.indicator.lowerBound) {
            ret.lowerThreshold = this.lowerThreshold
        }
        if (this.indicator.upperBound) {
            ret.upperThreshold = this.upperThreshold
        }
        if (this.alerts.length) {
            ret.alerts = this.alerts.map((alert) => alert.save())
        }
        return ret
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
}
