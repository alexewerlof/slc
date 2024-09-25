import { namify } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Metric } from './metric.js'
import { System } from './system.js'

const scopeIcon = icon('scope')

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
        const set = new Set(this.failures.map(failure => failure.consumption))
        return Array.from(set)
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

    removeFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        const index = this.failures.indexOf(failure)
        if (index === -1) {
            return false
        }
        this.failures.splice(index, 1)
        for (const metric of this.metrics) {
            metric.unLinkFailure(failure)
        }
        return true
    }

    isConsumedBy(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        return this.failures.some(f => f.consumption === consumption)
    }

    getConsumptionFailures(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        return this.failures.filter(f => f.consumption === consumption)
    }

    addConsumption(consumption) {
        if (this.isConsumedBy(consumption)) {
            return false
        }
        this.addNewFailure(consumption)
        return true
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

    removeMetric(metric) {
        if (!isInstance(metric, Metric)) {
            throw new Error(`Expected an instance of Metric. Got ${metric}`)
        }
        const index = this.metrics.indexOf(metric)
        if (index === -1) {
            return false
        }
        this.metrics.splice(index, 1)
        return true
    }

    toString() {
        return `${this.system.displayName}${scopeIcon}${this.displayName}`
    }

    toJSON() {
        return osloObj('Service', osloMetadata(
            namify(this.system.displayName, this.displayName),
            this.displayName,
        ), {
            description: this.description,
            failures: this.failures,
            metrics: this.metrics,
        })
    }

    get ref() {
        return this.system.services.indexOf(this)
    }

    save() {
        return {
            displayName: this.displayName,
            description: this.description,
            failures: this.failures.map(failure => failure.save()),
            metrics: this.metrics.map(metric => metric.save()),
        }
    }

    static load(system, serviceObj) {
        const newService = new Service(system, serviceObj.displayName, serviceObj.description)
        for (const failureObj of serviceObj.failures) {
            newService.addFailure(Failure.load(newService, failureObj))
        }
        for (const metricObj of serviceObj.metrics) {
            newService.addMetric(Metric.load(newService, metricObj))
        }
        return newService
    }
}