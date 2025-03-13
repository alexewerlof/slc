import { numL10n } from "./fmt.js"
import { countTimeslices, humanSec, humanTime, humanTimeSlices } from "./time.js"
import { isNum, isObj, isStr } from "./validation.js"

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class Window {
    // The raw number of seconds in this time window
    sec
    // An instance of SLI
    indicator
    constructor(indicator, sec) {
        if (!isObj(indicator)) {
            throw new TypeError(`Window: expected an indicator object. Got ${indicator}`)
        }
        this.indicator = indicator
        if (!isNum(sec)) {
            throw new TypeError(`Window: sec must be a number. Got ${ sec }`)
        }
        if (sec < 0) {
            throw new RangeError(`Window: sec must be a positive number. Got ${ sec }`)
        }
        this.sec = sec
    }

    get isTimeBased() {
        return this.indicator.timeslice > 0
    }

    /** Normalized unit */
    get eventUnitNorm() {
        return this.indicator.eventUnitNorm
    }

    get countTimeslices() {
        if (!this.indicator.isTimeBased) {
            throw new Error('Cannot calculate number of timeslices for a window that is not time-based')
        }
        return Math.floor(countTimeslices(this.sec, this.indicator.timeslice))
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
        if (this.indicator.isTimeBased) {
            ret += ` = ${ numL10n(this.countTimeslices) } ${ this.indicator.eventUnitNorm }`
        }
        ret += ')'
        return ret
    }
}