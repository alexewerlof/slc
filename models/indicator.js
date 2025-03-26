import { config } from '../config.js'
import { humanTimeSlices } from '../lib/time.js'
import { inRange, isInstance, isObj, isPosInt, isStr } from '../lib/validation.js'
import { Objective } from './objective.js'

/*
SLI budgeting method:
- event-based
- time-based
  - samples in regular intervals
  - aggregates values over time slices

By metric count:
- homogeneous (only good||bad metric)
- heterogeneous (good&&bad || good&&valid || bad&&valid metrics)

Metric data points impact its condition for good||bad:
- boolean
  - true || false
- numeric
  - range: UB&&LB || UB || LB (<, >, <=, >=) another name: below, above, between
  - point: ==, !=
*/

export class Indicator {
    // The title of the SLI
    title = config.title.default
    // The description of the SLI
    description = config.description.default
    // definition of valid events for event-based SLIs
    eventUnit = config.eventUnit.default
    // length of timeslice for time based SLIs. When it is negative, it indicates event based SLIs
    timeslice = config.timeslice.default
    // the metric that indicates whether an event or timeslice is good
    metricName = config.metricName.default
    // The unit of the metric that is used to identify good events
    metricUnit = config.metricUnit.default
    // The type of lower bound for the metric values that indicate a good event
    lowerBound = config.lowerBound.default
    // The type of upper bound for the metric values that indicate a good event
    upperBound = config.upperBound.default
    // Does this SLI use timeslots or events?
    isTimeBased = false
    // List of SLOs attached to this SLI
    objectives = []
    // For event based error budgets, this number holds the total valid events so we can compute the amount of allowed bad events
    _expectedDailyEvents = config.expectedDailyEvents.default
    get expectedDailyEvents() {
        return this._expectedDailyEvents
    }
    set expectedDailyEvents(value) {
        const { min, max } = config.expectedDailyEvents
        this._expectedDailyEvents = inRange(value, min, max) ? value : config.expectedDailyEvents.default
    }
    // Return the right unit regardless if it's a time-based or event-based indicator
    get eventUnitNorm() {
        return this.isTimeBased ? humanTimeSlices(this.timeslice) : this.eventUnit || 'events'
    }
    // Is there any bound
    get isBounded() {
        return Boolean(this.lowerBound) || Boolean(this.upperBound)
    }
    // Are both bounds needed
    get isRanged() {
        return Boolean(this.lowerBound) && Boolean(this.upperBound)
    }

    addObjective(objective) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`Indicator.addObjective(): Expected an instance of Objective. Got ${objective}`)
        }
        objective.indicator = this
        this.objectives.push(objective)
        return objective
    }
    addNewObjective() {
        return this.addObjective(new Objective(this))
    }
    removeObjective(objective) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`Indicator.removeObjective(): Expected an instance of Objective. Got ${objective}`)
        }
        const idx = this.objectives.indexOf(objective)
        if (idx === -1) {
            return new RangeError(`Indicator.removeObjective(): Objective not found: ${objective}`)
        }
        this.objectives.splice(idx, 1)
        return true
    }
    save() {
        const ret = {}
        if (this.title) {
            ret.displayName = this.title
        }
        if (this.description) {
            ret.description = this.description
        }
        if (this.metricName) {
            ret.metricName = this.metricName
        }
        if (this.metricUnit) {
            ret.metricUnit = this.metricUnit
        }
        if (this.expectedDailyEvents) {
            ret.expectedDailyEvents = this.expectedDailyEvents
        }
        if (this.lowerBound) {
            ret.lowerBound = this.lowerBound
        }
        if (this.upperBound) {
            ret.upperBound = this.upperBound
        }
        if (this.isTimeBased) {
            ret.timeslice = this.timeslice
        } else {
            ret.eventUnit = this.eventUnit
        }
        if (this.objectives.length) {
            ret.objectives = this.objectives.map((obj) => obj.save())
        }
        return ret
    }

    static load(data) {
        if (!isObj(data)) {
            throw new TypeError(`Indicator.load(): Expected a data object. Got ${data}`)
        }
        const indicator = new Indicator()

        if (isStr(data.displayName)) {
            indicator.title = data.displayName
        }

        if (isStr(data.description)) {
            indicator.description = data.description
        }

        if (isStr(data.metricName)) {
            indicator.metricName = data.metricName
        }

        if (isStr(data.metricUnit)) {
            indicator.metricUnit = data.metricUnit
        }

        if (isStr(data.lowerBound)) {
            if (!config.lowerBound.possibleValues.includes(data.lowerBound)) {
                throw new RangeError(
                    `load(): "lowerBound" must be one of ${config.lowerBound.possibleValues}. Got ${data.lowerBound}`,
                )
            }
            indicator.lowerBound = data.lowerBound
        }

        if (isStr(data.upperBound)) {
            if (!config.upperBound.possibleValues.includes(data.upperBound)) {
                throw new RangeError(
                    `load(): "upperBound" must be one of ${config.upperBound.possibleValues}. Got ${data.upperBound}`,
                )
            }
            indicator.upperBound = data.upperBound
        }

        if (isPosInt(data.timeslice)) {
            indicator.isTimeBased = true
            indicator.timeslice = data.timeslice
        } else {
            indicator.isTimeBased = false
            indicator.eventUnit = data.eventUnit || config.eventUnit.default
        }

        if (isPosInt(data.expectedDailyEvents)) {
            indicator.expectedDailyEvents = data.expectedDailyEvents
        }

        if (Array.isArray(data.objectives)) {
            for (const objectiveData of data.objectives) {
                indicator.addObjective(Objective.load(objectiveData, indicator))
            }
        }

        return indicator
    }

    toString() {
        if (this.title.trim()) {
            return this.title
        }
        if (this.metricName.trim()) {
            return this.metricName
        }
        return 'Indicator'
    }
}
