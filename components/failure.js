import { inRange, isDef, isInstance, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Usage } from './usage.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

/**
 * Represents a failure scenario: if a certain service fails, what activities will it impact and how?
 */
export class Failure extends Entity {
    usage = null
    symptom = ''
    consequence = ''
    businessImpact = ''
    impactLevel = config.impactLevel.default

    /**
     * Creates a new Failure instance.
     * @param {import('./usage.js').Usage} usage The usage this failure belongs to.
     * @param {Object} [state] Optional serialised state to restore.
     */
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

    /**
     * Returns the serialisable state of this Failure.
     * @returns {Object}
     */
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

    /**
     * Restores the Failure from a serialised state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { symptom, consequence, businessImpact, impactLevel } = newState

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

    /**
     * Called before this failure is removed. Unlinks it from all metrics that reference it.
     */
    onRemove() {
        this.service.metrics.forEach((metric) => {
            if (metric.isFailureLinked(this)) {
                metric.unLinkFailure(this)
            }
        })
    }

    /**
     * @returns {string}
     */
    toString() {
        const ret = [this.task, unicodeSymbol('failure'), this.service]
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

    /**
     * Index of this failure within the usage's failures array.
     * @returns {number}
     */
    get index() {
        return this.usage.failures.indexOf(this)
    }

    /**
     * A tuple of [usageIndex, failureIndex] that uniquely identifies this failure.
     * @returns {[number, number]}
     */
    get ref() {
        return [this.usage.index, this.index]
    }

    /**
     * The task associated with this failure (via usage).
     * @returns {import('./task.js').Task}
     */
    get task() {
        return this.usage.task
    }

    /**
     * The service associated with this failure (via usage).
     * @returns {import('./service.js').Service}
     */
    get service() {
        return this.usage.service
    }

    /**
     * All metrics linked to this failure.
     * @returns {import('./metric.js').Metric[]}
     */
    get metrics() {
        return this.service.metrics.filter((metric) => metric.isFailureLinked(this))
    }

    /**
     * Returns lint results for this failure.
     * @returns {import('./lint.js').Lint}
     */
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
