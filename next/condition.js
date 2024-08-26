import { config } from "../config.js"
import { entity2symbol } from "../lib/fmt.js"

export class Condition {
    constructor(
        lowerBound = config.lowerBound.default,
        upperBound = config.upperBound.default,
    ) {
        this.lowerBound = lowerBound
        this.upperBound = upperBound
    }

    set lowerBound(val) {
        if (!config.lowerBound.possibleValues.includes(val)) {
            throw new RangeError(`SLI: lowerBound must be one of ${config.lowerBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
        }
        this._lowerBound = val
    }

    get lowerBound() {
        return this._lowerBound
    }

    set upperBound(val) {
        if (!config.upperBound.possibleValues.includes(val)) {
            throw new RangeError(`SLI: upperBound must be one of ${config.upperBound.possibleValues.join(', ')}. Got ${val} (${typeof val})`)
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

export function oppositeBound(bound) {
    switch (bound) {
        case '':
            return ''
        case 'lt':
            return 'gt'
        case 'le':
            return 'ge'
        case 'gt':
            return 'lt'
        case 'ge':
            return 'le'
        default:
            throw new Error(`Invalid bound: ${htmlEntity}`)
    }
}

export function formula(good, sli, thresholds) {
    const { eventUnit, metricName, condition } = sli
    const ret = [eventUnit]
    ret.push('where')
    if (condition.isBounded) {
        if (condition.isLowerBounded) {
            ret.push(metricName)
            const { lowerBound } = condition
            ret.push(good ? entity2symbol(lowerBound) : entity2symbol(oppositeBound(lowerBound)))
            ret.push(thresholds ? thresholds.lower : '$LT')
            if (condition.isUpperBounded) {
                ret.push(good ? '&&' : '||')
            }
        }
        if (condition.isUpperBounded) {
            ret.push(metricName)
            const { upperBound } = condition
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

export function goodFormula(sli, thresholds) {
    return formula(true, sli, thresholds)
}

export function badFormula(sli, thresholds) {
    return formula(false, sli, thresholds)
}