import { inRange, isDef, isInstance, isObj, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Dependency } from './dependency.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

// If a certain service fails, what activities will it impact and how?
export class Failure extends Entity {
    dependency = null
    symptom = ''
    consequence = ''
    businessImpact = ''
    impactLevel = config.impactLevel.default

    constructor(dependency, state) {
        super()
        if (!isInstance(dependency, Dependency)) {
            throw new Error(`Expected an instance of Dependency. Got: ${dependency} (${typeof dependency})`)
        }
        this.dependency = dependency
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            id: this.id,
            symptom: this.symptom,
            consequence: this.consequence,
            businessImpact: this.businessImpact,
            impactLevel: this.impactLevel,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const {
            id,
            symptom,
            consequence,
            businessImpact,
            impactLevel,
        } = newState

        if (isDef(id)) {
            this.id = id
        }

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
        this.dependency.service.metrics.forEach((metric) => {
            if (metric.isFailureLinked(this)) {
                metric.unLinkFailure(this)
            }
        })
    }

    toString() {
        const ret = [
            this.dependency.task,
            unicodeSymbol('failure'),
            this.dependency.service,
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
        return this.dependency.failures.indexOf(this)
    }

    get ref() {
        return [this.dependency.index, this.index]
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

        return lint
    }
}
