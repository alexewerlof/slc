import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Consumption } from './consumption.js'

export class Consumer {
    consumptions = []

    constructor(assessment, title, description) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Consumer.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.title = title ?? ''
        this.description = description ?? ''
        this.consumptions = []
    }

    addConsumption(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Consumption must be an instance of Consumption. Got ${consumption}`)
        }
        consumption.consumer = this
        this.consumptions.push(consumption)
    }

    addNewConsumption(description) {
        this.addConsumption(new Consumption(this, undefined, description))
    }

    removeConsumption(consumption) {
        const index = this.consumptions.indexOf(consumption)
        if (index > -1) {
            this.consumptions.splice(index, 1)
        } else {
            throw new ReferenceError(`Consumption ${consumption} not found in consumer ${this}`)
        }
    }

    toString() {
        return this.title
    }
}