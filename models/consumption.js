import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'

export class Consumption {
    constructor(consumer, displayName = '', description = '') {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Consumption.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        this.displayName = displayName
        this.description = description
    }

    setDependency(service, value) {
        if (value) {
            service.addConsumption(this)
        } else {
            service.removeConsumption(this)
        }
    }

    hasNoDependency() {
        // TODO: this is not the most performant algorithm
        return this.consumer.assessment.allServices.some(service => service.failures.some(failure => failure.consumption === this))
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.displayName}::${this.displayName}`
    }

    toJSON() {
        return osloObj('Consumption', osloMetadata(undefined, this.displayName), {
            description: this.description,
        })
    }
}