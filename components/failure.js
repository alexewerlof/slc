import { inRange, isDef, isInstance, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Usage } from './usage.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

// If a certain service fails, what activities will it impact and how?
export class Failure extends Entity {
    usage = null
    symptom = ''
    consequence = ''
    businessImpact = ''
    impactLevel = config.impactLevel.default

    constructor(usage, state) {
        super('f', false)
        if (!isInstance(usage, Usage)) {
            throw new Error(`Expected an instance of Usage. Got: ${usage} (${typeof usage})`)
        }
        this.usage = usage
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = super.state

        if (this.symptom) {
            ret.symptom = this.symptom
        }
        if (this.consequence) {
            ret.consequence = this.consequence
        }
        if (this.businessImpact) {
            ret.businessImpact = this.businessImpact
        }
        if (this.impactLevel) {
            ret.impactLevel = this.impactLevel
        }

        return ret
    }

    set state(newState) {
        super.state = newState

        const {
            symptom,
            consequence,
            businessImpact,
            impactLevel,
        } = newState

        if (isDef(symptom)) {
            if (!isStr(symptom)) {
                throw new TypeError(`symptom should be a string. Got: ${symptom} (${typeof symptom})`)
            }
            this.symptom = symptom
        }

        if (isDef(consequence)) {
            if (!isStr(consequence)) {
                throw new TypeError(`consequence should be a string. Got: ${consequence} (${typeof consequence})`)
            }
            this.consequence = consequence
        }

        if (isDef(businessImpact)) {
            if (!isStr(businessImpact)) {
                throw new TypeError(
                    `businessImpact should be a string. Got: ${businessImpact} (${typeof businessImpact})`,
                )
            }
            this.businessImpact = businessImpact
        }

        if (isDef(impactLevel)) {
            if (!inRange(impactLevel, config.impactLevel.min, config.impactLevel.max)) {
                throw new TypeError(
                    `impactLevel should be a number in range ${config.impactLevel.min} - ${config.impactLevel.max}. Got: ${impactLevel}`,
                )
            }
            this.impactLevel = impactLevel
        }
    }

    onRemove() {
        this.usage.service.metrics.forEach((metric) => {
            if (metric.isFailureLinked(this)) {
                metric.unLinkFailure(this)
            }
        })
    }

    toString() {
        const ret = [
            this.usage.task,
            unicodeSymbol('failure'),
            this.usage.service,
        ]
        if (this.symptom) {
            ret.push(unicodeSymbol('symptom'), this.symptom)
        }
        if (this.consequence) {
            ret.push(unicodeSymbol('consequence'), this.consequence)
        }
        if (this.businessImpact) {
            ret.push(unicodeSymbol('impact'), this.businessImpact)
        }
        return ret.join(' ')
    }

    get index() {
        return this.usage.failures.indexOf(this)
    }

    get ref() {
        return [this.usage.index, this.index]
    }

    get metrics() {
        return this.usage.service.metrics.filter((metric) => metric.isFailureLinked(this))
    }

    get lint() {
        const lint = new Lint()

        if (this.symptom.length === 0) {
            lint.warn(`Please add a symptom to failure`)
        }

        if (this.consequence.length === 0) {
            lint.info(`Please add a consequence to failure`)
        }

        if (this.businessImpact.length === 0) {
            lint.info(`Please add a business impact to failure`)
        }

        if (this.metrics.length === 0) {
            lint.warn(`Currently no metric is measuring this failure. Please connect some metrics to this failure.`)
        }

        return lint
    }
}
