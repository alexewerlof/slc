import { config } from '../config.js'
import { FailureWindow } from '../lib/failure-window.js'
import { clamp, percent, toFixed } from '../lib/math.js'
import { daysToSeconds, secondsToDays } from '../lib/time.js'
import { inRange, isInstance, isNum, isObj, isPosInt } from '../lib/validation.js'
import { Window } from '../lib/window.js'
import { Alert } from './alert.js'
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
    constructor(indicator) {
        if (!isInstance(indicator, Indicator )) {
            throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
        }
        this.indicator = indicator
        this.window = new Window(
            indicator,
            daysToSeconds(config.windowDays.default),
        )
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
        this._lowerThreshold = inRange(value, min, Math.min(max, this.upperThreshold)) ? value : config.lowerThreshold.default
    }
    get upperThreshold() {
        return this._upperThreshold
    }
    set upperThreshold(value) {
        const { min, max } = config.upperThreshold
        this._upperThreshold = inRange(value, Math.max(min, this.lowerThreshold), max) ? value : config.upperThreshold.default
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
    get expectedTotalEvents() {
        return Math.round(this.indicator.expectedDailyEvents * this.windowDays) || config.expectedTotalEvents.min
    }
    set expectedTotalEvents(value) {
        this.indicator.expectedDailyEvents = Math.round(value / this.windowDays)
    }
    // The length of the SLO window in days
    set windowDays(days) {
        this.window.sec = daysToSeconds(days)
    }
    // Allows fine tuning the target by adding or removing a small amount
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
        return ret
    }

    static load(data, indicator) {
        if (!isObj(data)) {
            throw new TypeError(`Objective.load(): Expected a data object. Got ${data}`)
        }
        const objective = new Objective(indicator)

        if (isPosInt(data.target)) {
            objective.target = data.target
        }

        if (isPosInt(data.windowDays)) {
            objective.windowDays = data.windowDays
        }

        if (objective.indicator.lowerBound) {
            if (isNum(data.lowerThreshold)) {
                objective.lowerThreshold = data.lowerThreshold
            }
        }

        if (objective.indicator.upperBound) {
            if (isNum(data.upperThreshold)) {
                objective.upperThreshold = data.upperThreshold
            }
        }

        return objective;
    }
}