import { inRange, isDef, isInstance, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'

const failureIcon = icon('failure')

// If a certain service fails, what activities will it impact and how?
export class Failure {
    service = null
    consumption = null
    symptom = ''
    consequence = ''
    businessImpact = ''
    impactLevel = config.impactLevel.default

    constructor(
        service,
        state,
    ) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected a Service instance. Got ${service}`)
        }
        this.service = service
        if (isDef(state)) {
            this.state = state
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const {
            consumption,
            symptom,
            consequence,
            businessImpact,
            impactLevel,
        } = newState

        if (isDef(consumption)) {
            if (!isInstance(consumption, Consumption)) {
                throw new TypeError(
                    `consumption should be an instance of Consumption. Got: ${consumption} (${typeof consumption})`,
                )
            }
            this.consumption = consumption
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

    get metrics() {
        return this.service.metrics.filter((metric) => metric.isFailureLinked(this))
    }

    remove() {
        return this.service.removeFailure(this)
    }

    toString() {
        return `${this.consumption} ${failureIcon} ${this.service} ⇒ ${this.symptom}`
    }

    get index() {
        return this.service.failures.indexOf(this)
    }
}
