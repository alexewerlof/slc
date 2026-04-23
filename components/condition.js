import { isInstance } from '../dependencies/jty.js'
import { Metric } from './metric.js'

// TODO: add to config
const possibleTypes = [
    'boolean-true',
    'boolean-false',
    'point-EQ-$T',
    'point-NE-$T',
    'relative-LT-$UT',
    'relative-LE-$UT',
    'relative-GT-$LT',
    'relative-GE-$LT',
    'range-GT-$LT-LT-$UT',
    'range-GT-$LT-LE-$UT',
    'range-GE-$LT-LT-$UT',
    'range-GE-$LT-LE-$UT',
]

/**
 * Represents the condition that defines what constitutes a good metric reading for an SLI.
 */
export class Condition {
    /**
     * Creates a new Condition instance.
     * @param {import('./metric.js').Metric} metric The metric this condition belongs to.
     */
    constructor(metric) {
        if (!isInstance(metric, Metric)) {
            throw new TypeError(`Condition: metric must be an instance of Metric. Got ${metric}`)
        }
        this.type = possibleTypes[0] // TODO: read from config
        this.isParameterized = false
        this.metric = metric
        this.threshold = 0
        this.lowerThreshold = 0
        this.upperThreshold = 1000
    }

    /**
     * Returns a plain object describing the condition suitable for evaluation.
     * @returns {Object}
     */
    get conditionObject() {
        switch (this.type) {
            case 'boolean-true':
                return {
                    eq: true,
                }
            case 'boolean-false':
                return {
                    eq: false,
                }
            case 'numeric-point-EQ':
                return {
                    eq: this.pointValue,
                }
            default:
                throw new TypeError(`Condition: unknown condition type ${this.type}`)
        }
    }

    /**
     * Whether the single threshold input should be shown in the UI.
     * @returns {boolean}
     */
    get showThreshold() {
        return this.isParameterized && this.type.includes('$T')
    }

    /**
     * Whether the lower threshold input should be shown in the UI.
     * @returns {boolean}
     */
    get showLowerThreshold() {
        return this.isParameterized && this.type.includes('$LT')
    }

    /**
     * Whether the upper threshold input should be shown in the UI.
     * @returns {boolean}
     */
    get showUpperThreshold() {
        return this.isParameterized && this.type.includes('$UT')
    }

    /**
     * Returns the serialisable condition value based on current metric and condition type.
     * @returns {Object}
     */
    save() {
        const ret = {}

        if (this.metric.isBoolean) {
            return {
                eq: this.booleanValue,
            }
        }

        if (this.metric.isNumeric) {
            if (this.conditionType === 'range') {
                return {
                    gt: this.gt,
                    lt: this.lt,
                }
            }
        }

        return ret
    }
}
