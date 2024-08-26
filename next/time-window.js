import { numL10n } from "../lib/fmt.js"
import { daysToSeconds, getTimeSlices, humanSec, humanTime, humanTimeSlices } from "../lib/time.js"
import { isNum, isStr } from "../lib/validation.js"

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class TimeWindow {
    // The raw number of seconds in this time window
    sec
    // Valid events for the event-based SLIs
    eventUnit
    // If the timeslice is set to a positive number, the window is time-based
    timeslice
    constructor(sli, sec) {
        this.sli = sli

        if (!isNum(sec)) {
            throw new TypeError(`Window: sec must be a number. Got ${ sec }`)
        }
        if (sec < 0) {
            throw new RangeError(`Window: sec must be a positive number. Got ${ sec }`)
        }
        this.sec = sec
    }

    set days(days) {
        this.sec = daysToSeconds(days)
    }

    get days() {
        return this.sec / daysToSeconds(1)
    }

    get isTimeBased() {
        return this.timeslice > 0
    }

    get timesliceCount() {
        if (!this.sli.isTimeBased) {
            throw new Error('Cannot calculate number of timeslices for a window that is not time-based')
        }
        return Math.floor(getTimeSlices(this.sec, this.timeslice))
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
        if (this.sli.isTimeBased) {
            ret += ` = ${ numL10n(this.timesliceCount) } ${ this.eventUnitNorm }`
        }
        ret += ')'
        return ret
    }
}