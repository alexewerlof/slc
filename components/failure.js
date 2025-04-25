import { inRange, isDef, isInstance, isObj, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { icon } from '../lib/icons.js'
import { Dependency } from './dependency.js'

const failureIcon = icon('failure')

// If a certain service fails, what activities will it impact and how?
export class Failure {
    dependency = null
    symptom = ''
    consequence = ''
    businessImpact = ''
    impactLevel = config.impactLevel.default

    constructor(
        dependency,
        state,
    ) {
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

    toString() {
        return `${this.dependency.consumption} ${failureIcon} ${this.dependency.service} ⇒ ${this.symptom}`
    }

    get index() {
        return this.dependency.failures.indexOf(this)
    }
}
