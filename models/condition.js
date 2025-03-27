import { isInstance } from '../lib/validation.js'
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

export class Condition {
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
        }
    }

    get showThreshold() {
        return this.isParameterized && this.type.includes('$T')
    }

    get showLowerThreshold() {
        return this.isParameterized && this.type.includes('$LT')
    }

    get showUpperThreshold() {
        return this.isParameterized && this.type.includes('$UT')
    }

    save() {
        const ret = {}

        if (this.metric.isBoolean) {
            return {
                eq: this.booleanValue,
            }
        }

        if (this.metric.isNumeric) {
            if (this.conditionType = 'range') {
                return {
                    gt: this.gt,
                    lt: this.lt,
                }
            }
        }

        return ret
    }
}
