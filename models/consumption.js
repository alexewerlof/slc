import { namify } from '../lib/fmt.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { Service } from './service.js'

export class Consumption {
    constructor(consumer, title = '', description = '') {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Consumption.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        this.title = title
        this.description = description
        this.dependencies = []
    }

    hasDependency(service) {
        return this.dependencies.includes(service)
    }

    addDependency(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Consumption.addDependency: service must be an instance of Service. Got ${service}`)
        }
        if (!this.hasDependency(service)) {
            if (service.system.assessment !== this.consumer.assessment) {
                throw new Error(`Consumption.addDependency: service ${service} is not in the same assessment as ${this.consumer}`)
            }
            this.dependencies.push(service)
        }
    }

    removeDependency(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Consumption.removeDependency: service must be an instance of Service. Got ${service}`)
        }
        const index = this.dependencies.indexOf(service)
        if (index > -1) {
            this.dependencies.splice(index, 1)
        } else {
            throw new ReferenceError(`Service ${service} not found in dependencies of ${this}`)
        }
    }

    setDependency(service, value) {
        if (value) {
            this.addDependency(service)
        } else {
            this.removeDependency(service)
        }
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.title}::${this.title} (depends on ${this.dependencies.length} services)`
    }
}