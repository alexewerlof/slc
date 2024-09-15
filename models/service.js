import { isInstance } from '../lib/validation.js'
import { Metric } from './metric.js'
import { System } from './system.js'

export class Service {
    constructor(system, displayName = '', description = '', ...metrics) {
        if (!isInstance(system, System)) {
            throw new Error(`Service.constructor: system must be an instance of System. Got ${system}`)
        }
        this.system = system
        this.displayName = displayName
        this.description = description
        for (const metric of metrics) {
            if (!isInstance(metric, Metric)) {
                throw new Error(`Service.constructor: metrics must be instances of Metric. Got ${metric}`)
            }
        }
        this.metrics = []
    }

    get consumptions() {
        return this.system.assessment.allConsumptions.filter(consumption => consumption.hasDependency(this))
    }

    get failures() {
        return this.system.assessment.allFailures.filter(failure => failure.dependency.service === this)
    }

    remove() {
        this.system.removeService(this)
    }

    get failuresByRisk() {
        return this.failures.sort((f1, f2) => f2.risk.priority - f1.risk.priority)
    }

    addMetric(metric) {
        if (!isInstance(metric, Metric)) {
            throw new Error(`Expected an instance of Metric. Got ${metric}`)
        }
        metric.assessment = this
        this.metrics.push(metric)
        return metric
    }

    addNewMetric(displayName, description, ...risks) {
        return this.metrics.push(new Metric(this, displayName, description, ...risks))
    }

    toString() {
        return `${this.system.displayName}::${this.displayName}`
    }
}