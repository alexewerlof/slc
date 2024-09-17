import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'

// If a certain service fails, what activities will it impact and how?
export class Failure {
    constructor(
        service,
        consumption,
        symptom = '',
        consequence = '',
        businessImpact = '',
        likelihood = config.likelihood.default,
        impactLevel = config.impactLevel.default
    ) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected a Service instance. Got ${service}`)
        }
        this.service = service
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected a Consumption instance. Got ${consumption}`)
        }
        this.consumption = consumption
        this.symptom = symptom
        this.consequence = consequence
        this.businessImpact = businessImpact
        this.likelihood = likelihood
        this.impactLevel = impactLevel
    }

    get priority() {
        const likelihoodIndex = config.likelihood.possibleValues.indexOf(this.likelihood)
        if (likelihoodIndex === -1) {
            throw new RangeError(`Expected likelihood to be one of ${config.likelihood.possibleValues}. Got ${this.likelihood}`)
        }
        const impactLevelIndex = config.impactLevel.possibleValues.indexOf(this.impactLevel)
        if (impactLevelIndex === -1) {
            throw new RangeError(`Expected impactLevel to be one of ${config.impactLevel.possibleValues}. Got ${this.impactLevel}`)
        }
        const likelihoodValue = config.likelihood.possibleValues.length - likelihoodIndex
        const impactLevelValue = config.impactLevel.possibleValues.length - impactLevelIndex
        return likelihoodValue * impactLevelValue
    }

    toString() {
        return `${this.consumption} ⇸ ${this.service} ⇒ ${this.symptom}`
    }
}