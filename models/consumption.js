import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { Dependency } from './dependency.js'

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

    getDependency(service) {
        return this.dependencies.find(d => d.service === service)
    }

    addDependency(service) {
        let dependency = this.getDependency(service)
        if (!dependency) {
            dependency = new Dependency(this, service)
            this.dependencies.push(dependency)
        }
        return dependency
    }

    removeDependency(service) {
        const index = this.dependencies.findIndex(d => d.service === service)
        if (index > -1) {
            this.dependencies.splice(index, 1)
        } else {
            throw new ReferenceError(`Dependency ${this} does not depend on ${service}`)
        }
    }

    setDependency(service, value) {
        if (value) {
            this.addDependency(service)
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
        return `${this.consumer.title}::${this.title}`
    }
}