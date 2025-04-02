import { config } from '../config.js'
import { entity2symbolNorm } from '../lib/fmt.js'
import { rmItemGetNext } from '../lib/math.js'
import { humanTimeSlices } from '../lib/time.js'
import { inRange, isArr, isDef, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Formula } from './formula.js'
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
    /** @type {string} The title of the SLI */
    title = config.displayName.default

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
    objectives = []

    /** @type {Objective|undefined} the selected objective in UI */
    selObjective = undefined

    /** @private @type {number} For event based error budgets, this number holds the total valid events so we can compute the amount of allowed bad events*/
    _expectedDailyEvents = config.expectedDailyEvents.default

    constructor(options) {
        if (!isDef(options)) {
            return
        }

        if (!isObj(options)) {
            throw new TypeError(`option should be an object. Got ${options} (${typeof options})`)
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
        } = options

        if (isDef(displayName)) {
            if (!isStrLen(displayName, config.displayName.minLength, config.displayName.maxLength)) {
                throw new Error(`Invalid displayName: ${displayName} (${typeof displayName})`)
            }
            this.title = displayName
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
            if (!config.lowerBound.possibleValues.includes(lowerBound)) {
                throw new RangeError(`Invalid lowerBound: ${lowerBound} (${typeof lowerBound})`)
            }
            this.lowerBound = lowerBound
        }

        if (isDef(upperBound)) {
            if (!config.upperBound.possibleValues.includes(upperBound)) {
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
            for (const objectiveOptions of objectives) {
                this.addObjective(new Objective(this, objectiveOptions))
            }
        }
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

    addObjective(objective) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`Expected an instance of Objective. Got ${objective}`)
        }
        objective.indicator = this
        this.objectives.push(objective)
        this.selObjective = objective
        return objective
    }

    addNewObjective() {
        return this.addObjective(new Objective(this))
    }

    removeObjective(objective) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`Expected an instance of Objective. Got ${objective}`)
        }
        if (!this.objectives.includes(objective)) {
            throw new Error(`Objective does not belong to this indicator: ${objective}`)
        }
        this.selObjective = rmItemGetNext(this.objectives, this.selObjective)
        objective.indicator = undefined
    }

    removeSelectedObjective() {
        return this.removeObjective(this.selObjective)
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
        if (this.title.trim()) {
            return this.title
        }
        if (this.metricName.trim()) {
            return this.metricName
        }
        return 'Indicator without title or metric'
    }
}
