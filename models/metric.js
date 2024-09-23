import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'

export class Metric {
    constructor(service, displayName = '', description = '', ...measuredFailures) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        this.displayName = displayName
        this.description = description
        for (const failure of measuredFailures) {
            if (!isInstance(failure, Failure)) {
                throw new Error(`Expected failures to be instances of Failure. Got ${failure}`)
            }
        }
        this.measuredFailures = measuredFailures
    }

    measuresFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        return this.measuredFailures.includes(failure)
    }

    setFailure(failure, value) {
        if (value) {
            if (!this.measuresFailure(failure)) {
                this.measuredFailures.push(failure)
            }
        } else {
            const index = this.measuredFailures.indexOf(failure)
            if (index === -1) {
                throw new ReferenceError(`Failure ${failure} not found in metric ${this}`)
            }
            this.measuredFailures.splice(index, 1)
        }
    }

    toString() {
        return `${ this.service } ∡ ${this.displayName} (${ this.measuredFailures.length })`
    }

    remove() {
        return this.service.removeMetric(this)
    }

    toJSON() {
        return {
            displayName: this.displayName,
            description: this.description,
            // failures: this.failures,
        }
    }

    save() {
        return {
            displayName: this.displayName,
            description: this.description,
            measuredFailuresIndex: this.measuredFailures.map(failure => failure.index),
        }
    }

    static load(service, metricObj) {
        const measuredFailures = metricObj.measuredFailuresIndex.map(index => service.failures[index])
        const newMetric = new Metric(service, metricObj.displayName, metricObj.description, ...measuredFailures)
        return newMetric
    }
}