import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { clamp, percent } from '../lib/math.js'
import { daysToSeconds } from '../lib/time.js'
import { inRange, isInstance } from '../lib/validation.js'
import { Alert } from './alert.js'
import { badFormula, goodFormula } from './bound.js'
import { Cost } from '../lib/cost.js'
import { Indicator } from './indicator.js'
import { Thresholds } from './thresholds.js'
import { TimeWindow } from './time-window.js'

export class Objective {
    constructor(
        indicator,
        perc = config.slo.default,
        windowDays = config.windowDays.default,
        lowerThreshold = config.lowerThreshold.default,
        upperThreshold = config.upperThreshold.default,
        estimatedValidEvents = config.estimatedValidEvents.default,
    ) {
        if (!(indicator instanceof Indicator)) {
            throw new TypeError(`Objective: sli must be an instance of Indicator. Got ${ indicator }`)
        }
        this.indicator = indicator
        if (!inRange(perc, 0, 100)) {
            throw new RangeError(`Objective: perc must be a number between 0 and 100. Got ${ perc }`)
        }
        this.perc = perc
        this.window = new TimeWindow(this, daysToSeconds(windowDays))
        this.thresholds = new Thresholds(this, lowerThreshold, upperThreshold)
        this.estimatedValidEvents = estimatedValidEvents
        this.cost = new Cost()
        this.alerts = []
    }

    get perc() {
        return this._perc
    }

    set perc(val) {
        this._perc = clamp(val, config.slo.min, config.slo.max)
    }

    get good() {
        return goodFormula(this.indicator, this.thresholds)
    }

    get bad() {
        return badFormula(this.indicator, this.thresholds)
    }

    get valid() {
        return this.indicator.valid
    }

    get goodCount() {
        return Math.floor(percent(this.perc, this.validCount))
    }

    get badCount() {
        return this.validCount - this.goodCount
    }

    get validCount() {
        return this.indicator.isTimeBased ? this.window.countTimeslices() : this.estimatedValidEvents
    }

    set errorBudgetPerc(val) {
        this.perc = 100 - val
    }

    get errorBudgetPerc() {
        return 100 - this.perc
    }

    eventDeltaPerc(eventCount) {
        const { validCount } = this
        if (validCount === 0) {
            return -10
        }
        return eventCount * 100 / validCount
    }

    remove() {
        this.indicator.removeObjective(this)
    }

    addAlert(alert) {
        if(!isInstance(alert, Alert)) {
            throw new TypeError(`Objective: alert must be an instance of Alert. Got ${ alert }`)
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
            throw new TypeError(`Objective: alert must be an instance of Alert. Got ${ alert }`)
        }
        const index = this.alerts.indexOf(alert)
        if (index === -1) {
            throw new Error(`Objective: alert not found in alerts. Got ${ alert }`)
        }
        this.alerts.splice(index, 1)
    }

    toString() {
        const ret = []
        ret.push(percL10n(this.perc))
        ret.push('of')
        ret.push(this.indicator.eventUnitNorm)
        ret.push('over the last')
        ret.push(this.window.humanTimeSec)
        ret.push('have')
        ret.push(this.good)
        return ret.join(' ')
    }
}
