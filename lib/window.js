import { config } from "../config.js"
import { numL10n } from "./fmt.js"
import { countTimeslices, humanSec, humanTime, humanTimeSlices } from "./time.js"
import { inRange, isDef, isNum, isStr } from "./validation.js"

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class Window {
    // The raw number of seconds in this time window
    sec
    // Valid events for the event-based SLIs
    eventUnit
    // If the timeslice is set to a positive number, the window is time-based
    timeslice
    constructor(sec, eventUnit, timeslice) {
        if (!isNum(sec)) {
            throw new TypeError(`Window: sec must be a number. Got ${ sec }`)
        }
        if (sec < 0) {
            throw new RangeError(`Window: sec must be a positive number. Got ${ sec }`)
        }
        this.sec = sec

        if (!isStr(eventUnit)) {
            throw new TypeError(`Window: unit must be a number or a string. Got ${ eventUnit }`)
        }
        this.eventUnit = eventUnit

        if (!isNum(timeslice)) {
            throw new TypeError(`Window: timeslices must be a number. Got ${ timeslice }`)
        }
        this.timeslice = timeslice
    }

    get isTimeBased() {
        return this.timeslice > 0
    }

    /** Normalized unit */
    get eventUnitNorm() {
        return this.isTimeBased ? humanTimeSlices(this.timeslice) : this.eventUnit
    }

    get countTimeslices() {
        if (!this.isTimeBased) {
            throw new Error('Cannot calculate number of timeslices for a window that is not time-based')
        }
        return Math.floor(countTimeslices(this.sec, this.timeslice))
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
        if (this.isTimeBased) {
            ret += ` = ${ numL10n(this.countTimeslices) } ${ this.eventUnitNorm }`
        }
        ret += ')'
        return ret
    }
}