import { icon } from '../lib/icons.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'

const scopeIcon = icon('scope')

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

    get dependencyCount() {
        // TODO: this is not the most performant algorithm
        return this.consumer.assessment.allFailures.filter(failure => failure.consumption === this).length
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.displayName}${scopeIcon}${this.displayName}`
    }

    toJSON() {
        return osloObj('Consumption', osloMetadata(undefined, this.displayName), {
            description: this.description,
        })
    }

    get index() {
        return this.consumer.consumptions.indexOf(this)
    }

    save() {
        return {
            displayName: this.displayName,
            description: this.description,
        }
    }

    static load(consumer, consumptionObj) {
        const consumption = new Consumption(consumer, consumptionObj.displayName, consumptionObj.description)
        return consumption
    }
}