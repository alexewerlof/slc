import { numL10n } from '../lib/fmt.js'
import { daysToSeconds, countTimeslices, humanSec, humanTime, humanTimeSlices } from '../lib/time.js'
import { isInstance, isNum } from '../lib/validation.js'
import { Objective } from './objective.js'

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class TimeWindow {
    // The raw number of seconds in this time window
    sec
    constructor(objective, sec) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`TimeWindow: objective must be an instance of Objective. Got ${ objective }`)
        }
        this.objective = objective

        if (!isNum(sec)) {
            throw new TypeError(`TimeWindow: sec must be a number. Got ${ sec }`)
        }
        if (sec < 0) {
            throw new RangeError(`TimeWindow: sec must be positive. Got ${ sec }`)
        }
        this.sec = sec
    }

    set days(days) {
        this.sec = daysToSeconds(days)
    }

    get days() {
        return this.sec / daysToSeconds(1)
    }

    get countTimeslices() {
        if (this.objective.indicator.isEventBased) {
            throw new Error('Cannot calculate number of timeslices for an event-based Indicator')
        }
        return Math.floor(countTimeslices(this.sec, this.objective.indicator.timeslice))
    }

    get humanSec() {
        return humanSec(this.sec)
    }

    get humanTime() {
        return humanTime(this.sec)
    }

    get humanTimeSec() {
        return `${ this.humanTime } (${ this.humanSec })`
    }

    toString() {
        let ret = `${ this.humanTime } (${ this.humanSec }`
        if (this.objective.isTimeBased) {
            ret += ` = ${ numL10n(this.countTimeslices) } ${ this.objective.indicator.eventUnitNorm }`
        }
        ret += ')'
        return ret
    }
}