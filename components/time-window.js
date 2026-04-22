import { numL10n } from '../lib/fmt.js'
import { countTimeslices, daysToSeconds, humanSec, humanTime } from '../lib/time.js'
import { isInstance, isNum } from '../lib/validation.js'
import { Objective } from './objective.js'

/**
 * Represents a time window and has some utility methods that allow to uniformly represent
 * time windows in the UI.
 */
export class TimeWindow {
    // The raw number of seconds in this time window
    sec
    /**
     * Creates a new TimeWindow instance.
     * @param {import('./objective.js').Objective} objective The SLO this window belongs to.
     * @param {number} sec The window length in seconds.
     */
    constructor(objective, sec) {
        if (!isInstance(objective, Objective)) {
            throw new TypeError(`TimeWindow: objective must be an instance of Objective. Got ${objective}`)
        }
        this.objective = objective

        if (!isNum(sec)) {
            throw new TypeError(`TimeWindow: sec must be a number. Got ${sec}`)
        }
        if (sec < 0) {
            throw new RangeError(`TimeWindow: sec must be positive. Got ${sec}`)
        }
        this.sec = sec
    }

    /**
     * Sets the window length by converting days to seconds.
     * @param {number} days
     */
    set days(days) {
        this.sec = daysToSeconds(days)
    }

    /**
     * The window length in days.
     * @returns {number}
     */
    get days() {
        return this.sec / daysToSeconds(1)
    }

    /**
     * The number of timeslices in this window (time-based indicators only).
     * @returns {number}
     */
    get countTimeslices() {
        if (this.objective.indicator.isEventBased) {
            throw new Error('Cannot calculate number of timeslices for an event-based Indicator')
        }
        return Math.floor(countTimeslices(this.sec, this.objective.indicator.timeslice))
    }

    /**
     * Human-readable seconds string (e.g. "72h").
     * @returns {string}
     */
    get humanSec() {
        return humanSec(this.sec)
    }

    /**
     * Human-readable duration string (e.g. "3 days").
     * @returns {string}
     */
    get humanTime() {
        return humanTime(this.sec)
    }

    /**
     * Combined human time and seconds string.
     * @returns {string}
     */
    get humanTimeSec() {
        return `${this.humanTime} (${this.humanSec})`
    }

    /**
     * @returns {string}
     */
    toString() {
        let ret = `${this.humanTime} (${this.humanSec}`
        if (this.objective.isTimeBased) {
            ret += ` = ${numL10n(this.countTimeslices)} ${this.objective.indicator.eventUnitNorm}`
        }
        ret += ')'
        return ret
    }
}
