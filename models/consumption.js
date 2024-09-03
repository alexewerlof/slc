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

    get dependencies() {
        return this.consumer.assessment.allDependencies.filter(dependency => dependency.consumption === this)
    }

    hasDependency(service) {
        return Boolean(this.consumer.assessment.getDependency(this, service))
    }

    setDependency(service, value) {
        if (value) {
            this.consumer.assessment.addDependency(this, service)
        } else {
            this.consumer.assessment.removeDependency(this, service)
        }
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.title}::${this.title}`
    }
}