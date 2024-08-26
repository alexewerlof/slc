import { config } from "../config.js"
import { entity2symbol } from "../lib/fmt.js"
import { humanTimeSlices } from "../lib/time.js"
import { badFormula, Condition, goodFormula, oppositeBound } from "./condition.js"
import { SLO } from "./slo.js"

export class SLI {
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
        this.condition = new Condition(lowerBound, upperBound)
    }

    get good() {
        return goodFormula(this)
    }

    get bad() {
        return badFormula(this)
    }

    addObjective() {
        this.objectives.push(new SLO(this))
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
