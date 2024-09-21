import { namify } from '../lib/fmt.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Metric } from './metric.js'
import { System } from './system.js'

export class Service {
    constructor(system, displayName = '', description = '') {
        if (!isInstance(system, System)) {
            throw new Error(`Service.constructor: system must be an instance of System. Got ${system}`)
        }
        this.system = system
        this.displayName = displayName
        this.description = description
        this.failures = []
        this.metrics = []
    }

    get consumptions() {
        return this.system.assessment.allConsumptions.filter(consumption => consumption.hasDependency(this))
    }

    remove() {
        this.system.removeService(this)
    }

    get failuresByRisk() {
        return this.failures.sort((f1, f2) => f2.priority - f1.priority)
    }

    addFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        failure.service = this
        this.failures.push(failure)
        return failure
    }

    addNewFailure(consumption, symptom, consequence, businessImpact, likelihood, impactLevel) {
        return this.addFailure(new Failure(this, consumption, symptom, consequence, businessImpact, likelihood, impactLevel))
    }

    removeConsumption(consumption) {
        let removeCount = 0
        for (let i = this.failures.length - 1; i >= 0; i--) {
            if (this.failures[i].consumption === consumption) {
                removeCount++
                this.failures.splice(i, 1)
            }
        }
        return removeCount
    }

    addMetric(metric) {
        if (!isInstance(metric, Metric)) {
            throw new Error(`Expected an instance of Metric. Got ${metric}`)
        }
        metric.service = this
        this.metrics.push(metric)
        return metric
    }

    addNewMetric(displayName, description, ...failures) {
        return this.addMetric(new Metric(this, displayName, description, ...failures))
    }

    toString() {
        return `${this.system.displayName}::${this.displayName}`
    }

    toJSON() {
        return osloObj('Service', osloMetadata(
            namify([this.system.displayName, this.displayName].join('-')),
            this.displayName,
        ), {
            description: this.description,
            metrics: this.metrics,
        })
    }
}