import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { config } from '../config.js'
import { icon } from '../lib/icons.js'

const lowestPriority = config.likelihood.possibleValues.length * config.impactLevel.possibleValues.length
const metricIcon = icon('metric')

export class Metric {
    constructor(service, displayName = '', description = '', ...linkedFailures) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        this.displayName = displayName
        this.description = description
        for (const failure of linkedFailures) {
            if (!isInstance(failure, Failure)) {
                throw new Error(`Expected failures to be instances of Failure. Got ${failure}`)
            }
        }
        this.linkedFailures = linkedFailures
    }

    isFailureLinked(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        return this.linkedFailures.includes(failure)
    }

    linkFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        if (!this.isFailureLinked(failure)) {
            this.linkedFailures.push(failure)
        }
    }

    unLinkFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        const index = this.linkedFailures.indexOf(failure)
        if (index === -1) {
            throw new ReferenceError(`Failure ${failure} not found in metric ${this}`)
        }
        this.linkedFailures.splice(index, 1)
    }

    setFailure(failure, value) {
        if (value) {
            return this.linkFailure(failure)
        } else {
            return this.unLinkFailure(failure)
        }
    }

    get priority() {
        return Math.min(...this.linkedFailures.map(failure => failure.priority))
    }

    toString() {
        return `${ this.service } ${metricIcon} ${this.displayName}`
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
            linkedFailuresIndex: this.linkedFailures.map(failure => failure.index),
        }
    }

    static load(service, metricObj) {
        const linkedFailures = metricObj.linkedFailuresIndex.map(index => service.failures[index])
        const newMetric = new Metric(service, metricObj.displayName, metricObj.description, ...linkedFailures)
        return newMetric
    }
}