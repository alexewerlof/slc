import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'
import { clamp } from '../lib/math.js'

const failureIcon = icon('failure')

// If a certain service fails, what activities will it impact and how?
export class Failure {
    constructor(
        service,
        consumption,
        symptom = '',
        consequence = '',
        businessImpact = '',
        impactLevel = config.impactLevel.default,
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
        this.impactLevel = clamp(impactLevel, config.impactLevel.min, config.impactLevel.max)
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
