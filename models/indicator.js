import { config } from '../config.js'
import { humanTimeSlices } from '../lib/time.js'
import { badFormula, Bound, goodFormula } from './bound.js'
import { Objective } from './objective.js'
import { isInstance, isPosInt, isStr } from '../lib/validation.js'

export class Indicator {
    constructor(
        eventUnitOrTimeslice,
        metricName = config.metricName.default,
        metricUnit = config.metricUnit.default,
    ) {
        if (isStr(eventUnitOrTimeslice)) {
            this.eventUnit = eventUnitOrTimeslice
            this.isTimeBased = false
        } else {
            if (!isPosInt(eventUnitOrTimeslice)) {
                throw new TypeError(`Indicator: eventUnitOrTimeslice must be a positive integer. Got ${ eventUnitOrTimeslice } (${ typeof eventUnitOrTimeslice })`)
            }
            this.timeSliceLength = eventUnitOrTimeslice
            this.isTimeBased = true
        }
        this.metricName = metricName
        this.metricUnit = metricUnit
        this.timeSliceLength = 0
        this.objectives = []
        this.bound = new Bound(this)
        if (!isInstance(this.bound, Bound)) {
            throw new TypeError(`Indicator: bound must be an instance of Bound. Got ${ bound }`)
        }
    }

    get good() {
        return goodFormula(this)
    }

    get bad() {
        return badFormula(this)
    }

    get valid() {
        return `all ${ this.eventUnitNorm }`
    }

    addObjective(objective) {
        if(!isInstance(objective, Objective)) {
            throw new TypeError(`Indicator: objective must be an instance of Objective. Got ${ objective }`)
        }
        objective.indicator = this
        this.objectives.push(objective)
        return objective
    }

    addNewObjective() {
        return this.addObjective(new Objective(this))
    }

    removeObjective(index) {
        this.objectives.splice(index, 1)
    }

    get eventUnitNorm() {
        if (this.isEventBased) {
            return this.eventUnit || config.eventUnit.default
        }
        return humanTimeSlices(this.timeSliceLength)
    }

    get isEventBased() {
        return !this.isTimeBased
    }

    toString() {
        return this.eventUnitNorm + ' where ' + this.good
    }
}
