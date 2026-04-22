import { config } from '../config.js'
import { clamp } from '../lib/math.js'
import { inRange } from '../lib/validation.js'
import { Objective } from './objective.js'

/**
 * Manages the lower and upper numeric threshold values for an SLO, enforcing configured min/max ranges.
 */
export class Thresholds {
    /**
     * Creates a new Thresholds instance.
     * @param {import('./objective.js').Objective} slo The objective these thresholds belong to.
     * @param {number} [lower] Initial lower threshold value.
     * @param {number} [upper] Initial upper threshold value.
     */
    constructor(slo, lower = config.lowerThreshold.default, upper = config.upperThreshold.default) {
        if (!(slo instanceof Objective)) {
            throw new TypeError(`Thresholds: slo must be an instance of Objective. Got ${slo}`)
        }
        this.objective = slo

        if (!inRange(lower, config.lowerThreshold.min, config.lowerThreshold.max)) {
            throw new RangeError(
                `Objective: lowerThreshold must be a number between ${config.lowerThreshold.min} and ${config.lowerThreshold.max}. Got ${lower}`,
            )
        }
        this._lower = lower

        if (!inRange(upper, config.upperThreshold.min, config.upperThreshold.max)) {
            throw new RangeError(
                `Objective: upperThreshold must be a number between ${config.upperThreshold.min} and ${config.upperThreshold.max}. Got ${upper}`,
            )
        }
        this._upper = upper

        if (this.lower > this.upper) {
            throw new RangeError(
                `Objective: lowerThreshold must be less than upperThreshold. Got lowerThreshold=${lower} and upperThreshold=${upper}`,
            )
        }

        this.equalTo = '$ET'
    }

    /**
     * The minimum allowed value for the lower threshold.
     * @returns {number}
     */
    get lowerMin() {
        return config.lowerThreshold.min
    }

    /**
     * The maximum allowed value for the lower threshold (limited by the upper threshold when ranged).
     * @returns {number}
     */
    get lowerMax() {
        return this.objective.indicator.bound.isUpperBounded ? this.upper : config.lowerThreshold.max
    }

    /**
     * The minimum allowed value for the upper threshold (limited by the lower threshold when ranged).
     * @returns {number}
     */
    get upperMin() {
        return this.objective.indicator.bound.isLowerBounded ? this.lower : config.upperThreshold.min
    }

    /**
     * The maximum allowed value for the upper threshold.
     * @returns {number}
     */
    get upperMax() {
        return config.upperThreshold.max
    }

    /**
     * The lower threshold value.
     * @returns {number}
     */
    get lower() {
        return this._lower
    }

    /**
     * Sets the lower threshold, clamping and adjusting the upper if needed.
     * @param {number} val
     */
    set lower(val) {
        this._lower = clamp(val, this.lowerMin, this.lowerMax)
        if (this._lower > this._upper) {
            this.upper = this._lower
        }
    }

    /**
     * The upper threshold value.
     * @returns {number}
     */
    get upper() {
        return this._upper
    }

    /**
     * Sets the upper threshold, clamping and adjusting the lower if needed.
     * @param {number} val
     */
    set upper(val) {
        this._upper = clamp(val, this.upperMin, this.upperMax)
        if (this._upper < this._lower) {
            this.lower = this._upper
        }
    }
}
