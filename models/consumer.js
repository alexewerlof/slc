import { osloMetadata, osloObj } from '../lib/oslo.js'
import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Consumption } from './consumption.js'

export class Consumer {
    consumptions = []

    constructor(assessment, displayName = '', description = '') {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Consumer.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.displayName = displayName
        this.description = description
        this.consumptions = []
    }

    addConsumption(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Consumption must be an instance of Consumption. Got ${consumption}`)
        }
        consumption.consumer = this
        this.consumptions.push(consumption)
        return consumption
    }

    addNewConsumption(title, description) {
        return this.addConsumption(new Consumption(this, title, description))
    }

    removeConsumption(consumption) {
        const index = this.consumptions.indexOf(consumption)
        if (index > -1) {
            this.consumptions.splice(index, 1)
        } else {
            throw new ReferenceError(`Consumption ${consumption} not found in consumer ${this}`)
        }
    }

    remove() {
        return this.assessment.removeConsumer(this)
    }

    toString() {
        return this.displayName
    }

    toJSON() {
        return osloObj('Consumer', osloMetadata(undefined, this.displayName), {
            description: this.description,
            consumptions: this.consumptions,
        })
    }

    get index() {
        return this.assessment.consumers.indexOf(this)
    }

    save() {
        return {
            displayName: this.displayName,
            description: this.description,
            consumptions: this.consumptions.map(consumption => consumption.save())
        }
    }

    static load(assessment, consumerObj) {
        const newConsumer = new Consumer(assessment, consumerObj.displayName, consumerObj.description)
        for (const consumption of consumerObj.consumptions) {
            newConsumer.addConsumption(Consumption.load(newConsumer, consumption))
        }
        return newConsumer
    }
}