import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { osloObj } from '../lib/oslo.js'
import { icon } from '../lib/icons.js'

const failureIcon = icon('failure')

// If a certain service fails, what activities will it impact and how?
export class Failure {

    static possibleImpactLevels = [
        'Insignificant',
        'Minor',
        'Moderate',
        'Major',
        'Catastrophic',
    ]

    static possibleLikelihoods = [
        'Rare',
        'Unlikely',
        'Possible',
        'Likely',
        'Certain',
    ]

    constructor(
        service,
        consumption,
        symptom = '',
        consequence = '',
        businessImpact = '',
        likelihood = Failure.possibleLikelihoods[0],
        impactLevel = Failure.possibleImpactLevels[0],
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

    set likelihood(val) {
        if (!Failure.possibleLikelihoods.includes(val)) {
            throw new Error(`Expected likelihood to be one of ${Failure.possibleLikelihoods}. Got ${val}`)
        }
        this._likelihood = val
    }

    get likelihood() {
        return this._likelihood
    }

    set impactLevel(val) {
        if (!Failure.possibleImpactLevels.includes(val)) {
            throw new Error(`Expected impactLevel to be one of ${Failure.possibleImpactLevels}. Got ${val}`)
        }
        this._impactLevel = val
    }

    get impactLevel() {
        return this._impactLevel
    }

    get priority() {
        const likelihoodIndex = Failure.possibleLikelihoods.indexOf(this.likelihood)
        if (likelihoodIndex === -1) {
            throw new RangeError(`Expected likelihood to be one of ${Failure.possibleLikelihoods}. Got ${this.likelihood}`)
        }
        const impactLevelIndex = Failure.possibleImpactLevels.indexOf(this.impactLevel)
        if (impactLevelIndex === -1) {
            throw new RangeError(`Expected impactLevel to be one of ${Failure.possibleImpactLevels}. Got ${this.impactLevel}`)
        }
        const likelihoodValue = Failure.possibleLikelihoods.length - likelihoodIndex
        const impactLevelValue = Failure.possibleImpactLevels.length - impactLevelIndex
        return likelihoodValue * impactLevelValue
    }

    get metrics() {
        return this.service.metrics.filter(metric => metric.isFailureLinked(this))
    }

    remove() {
        return this.service.removeFailure(this)
    }

    toString() {
        return `${this.consumption} ${failureIcon} ${this.service} ⇒ ${this.symptom}`
    }

    toJSON() {
        return osloObj('Failure', undefined, {
            // service: this.service,
            // consumption: this.consumption,
            symptom: this.symptom,
            consequence: this.consequence,
            businessImpact: this.businessImpact,
            likelihood: this.likelihood,
            impactLevel: this.impactLevel,
        })
    }

    get index() {
        return this.service.failures.indexOf(this)
    }

    save() {
        return {
            consumerIndex: this.consumption.consumer.index,
            consumptionIndex: this.consumption.index,
            symptom: this.symptom,
            consequence: this.consequence,
            businessImpact: this.businessImpact,
            likelihood: this.likelihood,
            impactLevel: this.impactLevel,
        }
    }

    static load(service, failureObj) {
        const consumer = service.provider.assessment.consumers[failureObj.consumerIndex]
        const failure = new Failure(
            service,
            consumer.consumptions[failureObj.consumptionIndex],
            failureObj.symptom,
            failureObj.consequence,
            failureObj.businessImpact,
            failureObj.likelihood,
            failureObj.impactLevel
        )
        return failure
    }
}