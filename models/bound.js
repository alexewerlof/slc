import { config } from '../config.js'
import { entity2symbol, oppositeBound } from '../lib/fmt.js'
import { isInstance } from '../lib/validation.js'
import { Indicator } from './indicator.js'

export class Bound {
    constructor(
        indicator,
        lowerBound = config.lowerBound.default,
        upperBound = config.upperBound.default,
    ) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Bound: indicator must be an instance of Indicator. Got ${indicator}`)
        }
        this.indicator = indicator
        this.isRanged = true
        this.equalBound = ''
        this.lowerBound = lowerBound
        this.upperBound = upperBound
    }

    set lowerBound(val) {
        if (!config.lowerBound.possibleValues.includes(val)) {
            throw new RangeError(`Indicator: lowerBound must be one of ${config.lowerBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
        }
        this._lowerBound = val
    }

    get lowerBound() {
        return this._lowerBound
    }

    set upperBound(val) {
        if (!config.upperBound.possibleValues.includes(val)) {
            throw new RangeError(`Indicator: upperBound must be one of ${config.upperBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
        }
        this._upperBound = val
    }

    get upperBound() {
        return this._upperBound
    }

    get isBounded() {
        return this.isLowerBounded || this.isUpperBounded
    }

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

    get isLowerBounded() {
        return !!this.lowerBound
    }

    get isUpperBounded() {
        return !!this.upperBound
    }
}

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

export function goodFormula(indicator, thresholds) {
    return formula(true, indicator, thresholds)
}

export function badFormula(indicator, thresholds) {
    return formula(false, indicator, thresholds)
}