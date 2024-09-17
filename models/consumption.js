import { osloObj } from '../lib/oslo.js'
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

    getDependency(service) {
        return service.failures.find(f => f.consumption === this)
    }

    addDependency(service) {
        return service.addNewFailure(this)
    }

    removeDependency(service) {
        return service.removeConsumption(this)
    }

    setDependency(service, value) {
        if (value) {
            // If there's at least one failure, we're good
            if (!this.getDependency(service)) {
                this.addDependency(service)
            }
        } else {
            this.removeDependency(service)
        }
    }

    hasDependency(service) {
        return Boolean(this.getDependency(service))
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.displayName}::${this.displayName}`
    }

    toJSON() {
        return osloObj('Consumption', undefined, {
            displayName: this.displayName,
            description: this.description,
        })
    }
}