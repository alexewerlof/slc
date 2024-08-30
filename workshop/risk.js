import { Consumption } from './consumer.js'
import { ObjectWithId } from './obj-with-id.js'
import { Service } from './provider.js'

// If a certain service fails, what activities will it impact and how?
export class Failure extends ObjectWithId {
    constructor(service, consumption, symptom, consequence, businessImpact) {
        super()
        
        if (!service || !(service instanceof Service)) {
            throw new Error(`Failure must tie to a service. Got ${service}`)
        }
        this.service = service

        if (!consumption || !(consumption instanceof Consumption)) {
            throw new Error(`Failure must tie to a consumption. Got ${consumption}`)
        }
        consumption.addDependency(service)
        this.consumption = consumption
        
        this.symptom = symptom ?? ''
        this.consequence = consequence ?? ''
        this.businessImpact = businessImpact ?? ''
    }

    toString() {
        return `${this.consumption.name} >> ${this.symptom}`
    }
}