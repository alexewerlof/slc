import { percent } from "./sl-math.js"
import { humanSec, humanTime } from "./util.js"

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class Window {
    // The raw number of seconds in this time window
    #rawSec
    // Length of a time slot for the time-based SLIs. If 0, the SLI is event-based.
    #timeSlotSec
    // If the timeslot is set to a positive number, the window is time-based
    constructor(initRawSec, initTimeSlotSec = 0) {
        this.rawSec = initRawSec
        this.timeSlotSec = initTimeSlotSec
    }

    set rawSec(newVal) {
        if (!Number.isFinite(newVal) || newVal < 0) {
            throw new Error(`Invalid rawSec value: ${ newVal }`)
        }
        this.#rawSec = newVal
    }

    get rawSec() {
        return this.#rawSec
    }

    set timeSlotSec(newVal) {
        if (!Number.isFinite(newVal) || newVal < 0) {
            throw new Error(`Invalid timeSlotSec value: ${ newVal }`)
        }
        this.#timeSlotSec = newVal
    }

    get timeSlotSec() {
        return this.#timeSlotSec
    }

    /**
     * Returns a new window with the given percentage of the current window
     * 
     * @param {number} perc 0-100 number indicating the percentage of the new window
     * @returns a new window with the given percentage of the current window
     */
    newFractionalWindow(perc) {
        return new Window(percent(perc, this.rawSec), this.timeSlotSec)
    }

    get isTimeBased() {
        return this.timeSlotSec > 0
    }

    // Returns the window length fit to the total length of the whole time slots in it
    get fit() {
        return this.timeSlots * this.timeSlotSec
    }

    get timeSlots() {
        if (this.timeSlotSec === 0) {
            throw new Error('Cannot calculate number of time slots because timeSlot is 0 and it is not a time-based window')
        }
        return Math.floor(this.rawSec / this.timeSlotSec)
    }

    get humanTimeSlots() {
        return `${ this.timeSlots } Time Slots = ${ this.humanSec }`
    }

    get sec() {
        return this.isTimeBased ? this.fit : this.rawSec
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
        if (this.isTimeBased) {
            return `${ this.humanTime } (${ this.humanTimeSlots })`
        }
        return this.humanTimeSec
    }
}