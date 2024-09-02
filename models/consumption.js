import { namify } from '../lib/fmt.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'

export class Consumption {
    constructor(consumer, title = '', description = '') {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Consumption.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        this.title = title
        this.description = description
    }

    hasDependency(service) {
        return this.dependencies.includes(service)
    }

    addDependency(service) {
        if (!this.hasDependency(service)) {
            this.dependencies.push(service)
        }
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.title}::${this.title}`
    }
}