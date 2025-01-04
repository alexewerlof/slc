import { namify } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Metric } from './metric.js'
import { Provider } from './provider.js'

const scopeIcon = icon('scope')

export class Service {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']

    constructor(provider, displayName = '', description = '', type = Service.possibleTypes[0]) {
        if (!isInstance(provider, Provider)) {
            throw new Error(`Service.constructor: provider must be an instance of Provider. Got ${provider}`)
        }
        this.provider = provider
        this.displayName = displayName
        this.description = description
        this.failures = []
        this.metrics = []
        this.type = type
    }

    set type(val) {
        if (!Service.possibleTypes.includes(val)) {
            throw new Error(`Service.type must be one of ${Service.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    get consumptions() {
        const set = new Set(this.failures.map(failure => failure.consumption))
        return Array.from(set)
    }

    remove() {
        this.provider.removeService(this)
    }

    get failuresByRisk() {
        return this.failures.sort((f1, f2) => f2.impactLevel - f1.impactLevel)
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

    getConsumptionFailureMaxImpactLevel(consumption) {
        const failures = this.getConsumptionFailures(consumption)
        if (failures.length === 0) {
            return 0
        }
        return Math.max(...failures.map(f => f.impactLevel))
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

    addNewMetric(displayName, description, isBoolean, numericUnit) {
        return this.addMetric(new Metric(this, displayName, description, isBoolean, numericUnit))
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
        return `${this.provider.displayName}${scopeIcon}${this.displayName}`
    }

    toJSON() {
        return osloObj('Service', osloMetadata(
            namify(this.provider.displayName, this.displayName),
            this.displayName,
        ), {
            description: this.description,
            failures: this.failures,
            metrics: this.metrics,
        })
    }

    get ref() {
        return this.provider.services.indexOf(this)
    }

    save() {
        return {
            displayName: this.displayName,
            description: this.description,
            type: this.type,
            failures: this.failures.map(failure => failure.save()),
            metrics: this.metrics.map(metric => metric.save()),
        }
    }

    static load(provider, serviceObj) {
        const newService = new Service(provider, serviceObj.displayName, serviceObj.description, serviceObj.type)
        for (const failureObj of serviceObj.failures) {
            newService.addFailure(Failure.load(newService, failureObj))
        }
        for (const metricObj of serviceObj.metrics) {
            newService.addMetric(Metric.load(newService, metricObj))
        }
        return newService
    }
}