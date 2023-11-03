import { numL10n } from "./fmt.js"
import { percent } from "./math.js"
import { getTimeSlots, humanSec, humanTime } from "./time.js"
import { isNum } from "./validation.js"

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
        this.sec = sec
        this.unit = unit
    }

    get isTimeBased() {
        return isNum(this.unit)
    }

    /**
     * Creates a new window which is perc% of the curren window
     * 
     * @param {number} perc 0-100 number indicating the percentage of the new window
     * @returns a new window with the given percentage of the current window
     */
    newFractionalWindow(perc) {
        return new Window(percent(perc, this.sec), this.unit)
    }

    get timeSlotsFloor() {
        if (!this.isTimeBased) {
            throw new Error('Cannot calculate number of time slots for a window that is not time-based')
        }
        return Math.floor(getTimeSlots(this.sec, this.unit))
    }

    get timeSlotsCeil() {
        if (!this.isTimeBased) {
            throw new Error('Cannot calculate number of time slots for a window that is not time-based')
        }
        return Math.ceil(getTimeSlots(this.sec, this.unit))
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
            ret += ` = ${ numL10n(this.timeSlotsFloor) } Time Slots`
        }
        ret += ')'
        return ret
    }
}