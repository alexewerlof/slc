import { config } from '../config.js'
import { entity2symbolNorm } from '../lib/fmt.js'
import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { humanTimeSlices } from '../lib/time.js'
import { inRange, isArr, isDef, isInArr, isObj, isStrLen } from '../lib/validation.js'
import { Formula } from './ui/formula.js'
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

/**
 * Represents the options used to configure an Indicator instance.
 * @typedef {Object} IndicatorOptions
 * @property {string} [displayName] The display name (title) of the indicator.
 * @property {string} [description] A brief description of the indicator.
 * @property {string} [metricName] The name of the metric used to evaluate the indicator.
 * @property {string} [metricUnit] The unit of the metric used to evaluate the indicator.
 * @property {string} [lowerBound] The type of lower bound for the metric values that indicate a good event.
 * @property {string} [upperBound] The type of upper bound for the metric values that indicate a good event.
 * @property {number} [timeslice] The length of each timeslice for time-based indicators.
 * @property {string} [eventUnit] The unit of valid events for event-based indicators.
 * @property {number} [expectedDailyEvents] The expected number of valid events per day for event-based indicators.
 * @property {Objective[]} [objectives] A list of objectives associated with the indicator.
 */

export class Indicator extends Entity {
    /** @type {string} The title of the SLI */
    displayName = config.displayName.default

    /** @type {string} The description of the SLI */
    description = config.description.default

    /** @type {string} Definition of valid events for event-based SLIs */
    eventUnit = config.eventUnit.default

    /** @type {number} Length of timeslice for time-based SLIs */
    timeslice = config.timeslice.default

    /** @type {string} The metric that indicates whether an event or timeslice is good */
    metricName = config.metricName.default

    /** @type {string} The unit of the metric that is used to identify good events */
    metricUnit = config.metricUnit.default

    /** @type {string} The type of lower bound for the metric values that indicate a good event */
    lowerBound = config.lowerBound.default

    /** @type {string} The type of upper bound for the metric values that indicate a good event */
    upperBound = config.upperBound.default

    /** @type {boolean} Does this SLI use timeslots or events? */
    isTimeBased = false

    /** @type {Objective[]} List of SLOs attached to this SLI */
    objectives = new SelectableArray(Objective, this)

    /** @type {Objective|undefined} the selected objective in UI */
    selObjective = undefined

    /** @private @type {number} For event based error budgets, this number holds the total valid events so we can compute the amount of allowed bad events*/
    _expectedDailyEvents = config.expectedDailyEvents.default

    /**
     * Creates a new Indicator object (SLI).
     * @param {IndicatorOptions} [state] The options used to configure the indicator.
     */
    constructor(state) {
        super('i')
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = {}
        if (this.displayName) {
            ret.displayName = this.displayName
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
            ret.objectives = this.objectives.map((obj) => obj.state)
        }
        return ret
    }

    /**
     * Initializes the Indicator object with the provided options.
     * @param {IndicatorOptions} [newState] The options used to configure the indicator.
     */
    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got ${newState} (${typeof newState})`)
        }

        const {
            displayName,
            description,
            metricName,
            metricUnit,
            lowerBound,
            upperBound,
            timeslice,
            eventUnit,
            expectedDailyEvents,
            objectives,
        } = newState

        if (isDef(displayName)) {
            if (!isStrLen(displayName, config.displayName.minLength, config.displayName.maxLength)) {
                throw new Error(`Invalid displayName: ${displayName} (${typeof displayName})`)
            }
            this.displayName = displayName
        }

        if (isDef(description)) {
            if (!isStrLen(description, config.description.minLength, config.description.maxLength)) {
                throw new Error(`Invalid description: ${description} (${typeof description})`)
            }
            this.description = description
        }

        if (isDef(metricName)) {
            if (!isStrLen(metricName, config.metricName.minLength, config.metricName.maxLength)) {
                throw new Error(`Invalid metricName: ${metricName} ${typeof metricName}`)
            }
            this.metricName = metricName
        }

        if (isDef(metricUnit)) {
            if (!isStrLen(metricUnit, config.metricUnit.minLength, config.metricUnit.maxLength)) {
                throw new Error(`Invalid metricUnit: ${metricUnit} (${typeof metricUnit})`)
            }
            this.metricUnit = metricUnit
        }

        if (isDef(lowerBound)) {
            if (!isInArr(lowerBound, config.lowerBound.possibleValues)) {
                throw new RangeError(`Invalid lowerBound: ${lowerBound} (${typeof lowerBound})`)
            }
            this.lowerBound = lowerBound
        }

        if (isDef(upperBound)) {
            if (!isInArr(upperBound, config.upperBound.possibleValues)) {
                throw new RangeError(`Invalid upperBound: ${upperBound} (${typeof upperBound})`)
            }
            this.upperBound = upperBound
        }

        if (isDef(timeslice)) {
            if (!inRange(timeslice, config.timeslice.min, config.timeslice.max)) {
                throw new RangeError(`Invalid timeslice: ${timeslice} (${typeof timeslice})`)
            }
            this.isTimeBased = true
            this.timeslice = timeslice
        }

        if (isDef(eventUnit)) {
            if (!isStrLen(eventUnit, config.eventUnit.minLength, config.eventUnit.maxLength)) {
                throw new Error(`Invalid eventUnit: ${eventUnit} (${typeof eventUnit})`)
            }
            this.eventUnit = eventUnit
        }

        if (isDef(expectedDailyEvents)) {
            if (!inRange(expectedDailyEvents, config.expectedDailyEvents.min, config.expectedDailyEvents.max)) {
                throw new Error(`Invalid expectedDailyEvents: ${expectedDailyEvents} (${typeof expectedDailyEvents})`)
            }
            this.expectedDailyEvents = expectedDailyEvents
        }

        if (isDef(objectives)) {
            if (!isArr(objectives)) {
                throw new TypeError(`Invalid objectives array: ${objectives} (${typeof objectives})`)
            }
            this.objectives.state = objectives
        }
    }

    get category() {
        if (this.displayName && this.displayName.includes(':')) {
            return this.displayName.split(':')[0].trim()
        }
        return undefined
    }

    get expectedDailyEvents() {
        return this._expectedDailyEvents
    }

    set expectedDailyEvents(value) {
        const { min, max } = config.expectedDailyEvents
        this._expectedDailyEvents = inRange(value, min, max) ? value : config.expectedDailyEvents.default
    }

    /** Return the right unit regardless if it's a time-based or event-based indicator */
    get eventUnitNorm() {
        return this.isTimeBased ? humanTimeSlices(this.timeslice) : this.eventUnit || 'events'
    }

    /** @type {boolean} Is there any bound */
    get isBounded() {
        return Boolean(this.lowerBound) || Boolean(this.upperBound)
    }

    /** @type {boolean} Are both bounds needed */
    get isRanged() {
        return Boolean(this.lowerBound) && Boolean(this.upperBound)
    }

    get formula() {
        const ret = new Formula()

        ret.addFunct('Percentage_of')
        ret.addSpace()
        ret.addExpr(this.eventUnitNorm, 'sli-event-unit')
        ret.addSpace()
        ret.addFunct('where')
        ret.addSpace()

        if (this.lowerBound) {
            ret.addConst('$LT', 'lower-threshold-input')
            ret.addSpace()
            ret.addPunct(entity2symbolNorm(this.lowerBound), 'lower-bound-type')
            ret.addSpace()
        }

        ret.addExpr(this.metricName, 'sli-metric-name')

        if (this.upperBound) {
            ret.addSpace()
            ret.addPunct(entity2symbolNorm(this.upperBound), 'upper-bound-type')
            ret.addSpace()
            ret.addConst('$UT', 'upper-threshold-input')
        }

        ret.addSpace()
        ret.addFunct('during')
        ret.addSpace()

        ret.addConst('$Window', 'slo-window-unit-multiplier')

        return ret
    }

    toString() {
        if (this.displayName.trim()) {
            return this.displayName
        }
        if (this.metricName.trim()) {
            return this.metricName
        }
        return 'Indicator without title or metric'
    }
}
