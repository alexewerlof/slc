import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { config } from '../config.js'
import { icon } from '../lib/icons.js'
import { Condition } from './condition.js'

const lowestPriority = config.likelihood.possibleValues.length * config.impactLevel.possibleValues.length
const metricIcon = icon('metric')

export class Metric {
    constructor(service, displayName = '', description = '', isBoolean = false, numericUnit = '' ) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        this.displayName = displayName
        this.description = description
        this.isBoolean = isBoolean
        this.numericUnit = numericUnit
        this.condition = new Condition(this)
        this.linkedFailures = []
    }

    get unit() {
        return this.isNumeric ? this.numericUnit : 'True/False'
    }

    get isNumeric() {
        return !this.isBoolean
    }

    set isNumeric(value) {
        this.isBoolean = !value
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
            isNumeric: this.isNumeric,
            numericUnit: this.numericUnit,
            linkedFailuresIndex: this.linkedFailures.map(failure => failure.index),
        }
    }

    static load(service, metricObj) {
        const { displayName, description, isBoolean, numericUnit, linkedFailuresIndex } = metricObj
        const newMetric = new Metric(service, displayName, description, isBoolean, numericUnit)
        
        for (const failureIndex of linkedFailuresIndex) {
            newMetric.linkFailure(service.failures[failureIndex])
        }

        return newMetric
    }
}