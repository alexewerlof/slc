import { config } from '../config.js'
import { entity2symbol, oppositeBound } from '../lib/fmt.js'
import { inArr, isInstance } from '../dependencies/jty.js'
import { Indicator } from './indicator.js'

/**
 * Encapsulates the lower and upper bound configuration for an Indicator.
 */
export class Bound {
    /**
     * Creates a new Bound instance.
     * @param {import('./indicator.js').Indicator} indicator The indicator this bound belongs to.
     * @param {string} [lowerBound] The lower bound type (defaults to config value).
     * @param {string} [upperBound] The upper bound type (defaults to config value).
     */
    constructor(indicator, lowerBound = config.lowerBound.default, upperBound = config.upperBound.default) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Bound: indicator must be an instance of Indicator. Got ${indicator}`)
        }
        this.indicator = indicator
        this.isRanged = true
        this.equalBound = ''
        this.lowerBound = lowerBound
        this.upperBound = upperBound
    }

    /**
     * Sets the lower bound type, validating against configured possible values.
     * @param {string} val
     */
    set lowerBound(val) {
        if (!inArr(val, config.lowerBound.possibleValues)) {
            throw new RangeError(
                `Indicator: lowerBound must be one of ${config.lowerBound.possibleValues.join(
                    ', ',
                )}. Got ${val} (${typeof val})`,
            )
        }
        this._lowerBound = val
    }

    /**
     * The lower bound type.
     * @returns {string}
     */
    get lowerBound() {
        return this._lowerBound
    }

    /**
     * Sets the upper bound type, validating against configured possible values.
     * @param {string} val
     */
    set upperBound(val) {
        if (!inArr(val, config.upperBound.possibleValues)) {
            throw new RangeError(
                `Indicator: upperBound must be one of ${config.upperBound.possibleValues.join(
                    ', ',
                )}. Got ${val} (${typeof val})`,
            )
        }
        this._upperBound = val
    }

    /**
     * The upper bound type.
     * @returns {string}
     */
    get upperBound() {
        return this._upperBound
    }

    /**
     * Whether at least one bound (lower or upper) is set.
     * @returns {boolean}
     */
    get isBounded() {
        return this.isLowerBounded || this.isUpperBounded
    }

    /**
     * Enables or disables both bounds by applying or clearing default bound values.
     * @param {boolean} val
     */
    set isBounded(val) {
        console.log('isBounded', val)
        if (val) {
            this.lowerBound = config.lowerBound.default
            this.upperBound = config.upperBound.default
        } else {
            this.lowerBound = ''
            this.upperBound = ''
        }
    }

    /**
     * Whether the lower bound is set.
     * @returns {boolean}
     */
    get isLowerBounded() {
        return !!this.lowerBound
    }

    /**
     * Whether the upper bound is set.
     * @returns {boolean}
     */
    get isUpperBounded() {
        return !!this.upperBound
    }
}

/**
 * Builds a formula string for a metric condition.
 * @param {boolean} good True for the good-event formula, false for the bad-event formula.
 * @param {import('./indicator.js').Indicator} indicator
 * @param {import('./thresholds.js').Thresholds} [thresholds]
 * @returns {string}
 */
export function formula(good, indicator, thresholds) {
    const { metricName, bound } = indicator
    const ret = []
    if (bound.isBounded) {
        if (bound.isLowerBounded) {
            ret.push(metricName)
            const { lowerBound } = bound
            ret.push(good ? entity2symbol(lowerBound) : entity2symbol(oppositeBound(lowerBound)))
            ret.push(thresholds ? thresholds.lower : '$LT')
            if (bound.isUpperBounded) {
                ret.push(good ? '&&' : '||')
            }
        }
        if (bound.isUpperBounded) {
            ret.push(metricName)
            const { upperBound } = bound
            ret.push(good ? entity2symbol(upperBound) : entity2symbol(oppositeBound(upperBound)))
            ret.push(thresholds ? thresholds.upper : '$UT')
        }
    } else {
        ret.push(metricName)
        ret.push(good ? '==' : '!=')
        ret.push(thresholds ? thresholds.equalTo : 'true')
    }

    return ret.join(' ')
}

/**
 * Returns the formula string for good events.
 * @param {import('./indicator.js').Indicator} indicator
 * @param {import('./thresholds.js').Thresholds} [thresholds]
 * @returns {string}
 */
export function goodFormula(indicator, thresholds) {
    return formula(true, indicator, thresholds)
}

/**
 * Returns the formula string for bad events.
 * @param {import('./indicator.js').Indicator} indicator
 * @param {import('./thresholds.js').Thresholds} [thresholds]
 * @returns {string}
 */
export function badFormula(indicator, thresholds) {
    return formula(false, indicator, thresholds)
}
