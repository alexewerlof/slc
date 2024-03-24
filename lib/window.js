import { numL10n } from "./fmt.js"
import { getTimeSlots, humanSec, humanTime, normalizeUnit } from "./time.js"
import { isNum, isStr } from "./validation.js"

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class Window {
    // The raw number of seconds in this time window
    sec
    // Length of a time slot for the time-based SLIs. If 0, the SLI is event-based.
    unit
    // If the timeslot is set to a positive number, the window is time-based
    constructor(sec, unit) {
        if (!isNum(sec) || sec < 0) {
            throw new Error(`Window: sec must be a positive number. Got ${ sec }`)
        }
        this.sec = sec

        if (!isNum(unit) && !isStr(unit)) {
            throw new Error(`Window: unit must be a number or a string. Got ${ unit }`)
        }
        this.unit = unit
    }

    get isTimeBased() {
        return isNum(this.unit)
    }

    /** Normalized unit */
    get normUnit() {
        return normalizeUnit(this.unit)
    }

    get timeSlotCount() {
        if (!this.isTimeBased) {
            throw new Error('Cannot calculate number of time slots for a window that is not time-based')
        }
        return Math.floor(getTimeSlots(this.sec, this.unit))
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
            ret += ` = ${ numL10n(this.timeSlotCount) } ${ this.normUnit }`
        }
        ret += ')'
        return ret
    }
}