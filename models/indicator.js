import { config } from '../config.js'
import { humanTimeSlices } from '../lib/time.js'
import { badFormula, Bound, goodFormula } from './bound.js'
import { Objective } from './objective.js'
import { isInstance } from '../lib/validation.js'

export class Indicator {
    constructor(
        eventUnit,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
    ) {
        this.eventUnit = eventUnit ?? config.eventUnit.default
        this.metricName = metricName ?? config.metricName.default
        this.metricUnit = metricUnit ?? config.metricUnit.default
        this.timeSliceLength = 0
        this.objectives = []
        this.condition = new Bound(lowerBound, upperBound)
        this.name = 'some dummy name'
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
    }

    addNewObjective() {
        this.addObjective(new Objective(this))
    }

    removeObjective(index) {
        this.objectives.splice(index, 1)
    }

    get eventUnitNorm() {
        if (this.isEventBased) {
            return this.eventUnit || 'events'
        }
        return humanTimeSlices(this.timeSliceLength)
    }

    get isEventBased() {
        return this.timeSliceLength <= 0
    }

    get isTimeBased() {
        return !this.isEventBased
    }

    toString() {
        return this.eventUnitNorm + ' where ' + this.good
    }
}
