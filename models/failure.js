import { isInstance } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Service } from './service.js'

// If a certain service fails, what activities will it impact and how?
export class Failure {
    constructor(service, consumption, symptom = '', consequence = '', businessImpact = '') {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected a Service instance. Got ${service}`)
        }
        this.service = service

        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected a Consumption instance. Got ${consumption}`)
        }
        this.consumption = consumption
        
        this.symptom = symptom
        this.consequence = consequence
        this.businessImpact = businessImpact
    }

    toString() {
        return `${this.consumption} >> ${this.symptom}`
    }
}