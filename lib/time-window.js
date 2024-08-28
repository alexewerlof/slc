import { numL10n } from './fmt.js'
import { daysToSeconds, countTimeslices, humanSec, humanTime, humanTimeSlices } from './time.js'
import { isNum, isStr } from './validation.js'

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class TimeWindow {
    // The raw number of seconds in this time window
    sec
    // If the timeslice is set to a positive number, the window is time-based
    timeslice
    constructor(slo, sec) {
        this.objective = slo

        if (!isNum(sec)) {
            throw new TypeError(`Window: sec must be a number. Got ${ sec }`)
        }
        if (sec < 0) {
            throw new RangeError(`Window: sec must be positive. Got ${ sec }`)
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