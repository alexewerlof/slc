import { config } from "../config.js"
import { entity2symbol } from "../lib/fmt.js"
import { humanTimeSlices } from "../lib/time.js"
import { SLO } from "./slo.js"

export class SLI {
    constructor(metricName, metricUnit, lowerBound = '', upperBound = '') {
        this.metricName = metricName
        this.metricUnit = metricUnit
        this.lowerBound = lowerBound
        this.upperBound = upperBound
        this.eventUnit = 'requests'
        this.timeSliceLength = 0
        this.objectives = []
    }

    set lowerBound(val) {
        if (!config.lowerBound.possibleValues.includes(val)) {
            throw new RangeError(`SLI: lowerBound must be one of ${config.lowerBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
        }
        this._lowerBound = val
    }

    get lowerBound() {
        return this._lowerBound
    }

    set upperBound(val) {
        if (!config.upperBound.possibleValues.includes(val)) {
            throw new RangeError(`SLI: upperBound must be one of ${config.upperBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
        }
        this._upperBound = val
    }

    get upperBound() {
        return this._upperBound
    }

    get good() {
        const ret = []
        if (this.isLowerBounded) {
            ret.push('$LT')
            ret.push(entity2symbol(this.lowerBound))
            ret.push(this.metricName)
            if (this.upperBound) {
                ret.push('&&')
            }
        }
        if (this.isUpperBounded) {
            ret.push(entity2symbol(this.upperBound))
            ret.push('$GT')
            ret.push(this.metricName)
        }
        return ret.join(' ')
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

    get isBounded() {
        return this.isLowerBounded || this.isUpperBounded
    }

    get isLowerBounded() {
        return !!this.lowerBound
    }

    get isUpperBounded() {
        return !!this.upperBound
    }
}
