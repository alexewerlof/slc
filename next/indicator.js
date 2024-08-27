import { config } from "../config.js"
import { humanTimeSlices } from "../lib/time.js"
import { badFormula, Bound, goodFormula } from "./bound.js"
import { Objective } from "./objective.js"

export class Indicator {
    constructor(
        level,
        eventUnit,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
    ) {
        this.level = level
        this.eventUnit = eventUnit ?? config.eventUnit.default
        this.metricName = metricName ?? config.metricName.default
        this.metricUnit = metricUnit ?? config.metricUnit.default
        this.timeSliceLength = 0
        this.objectives = []
        this.condition = new Bound(lowerBound, upperBound)
    }

    get good() {
        return goodFormula(this)
    }

    get bad() {
        return badFormula(this)
    }

    addObjective(objective) {
        if(!(objective instanceof Objective)) {
            throw new TypeError(`Indicator: objective must be an instance of Objective. Got ${ objective }`)
        }
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
            return this.eventName || 'events'
        }
        return humanTimeSlices(this.timeSliceLength)
    }

    get isEventBased() {
        return this.timeSliceLength <= 0
    }

    get isTimeBased() {
        return !this.isEventBased
    }
}
