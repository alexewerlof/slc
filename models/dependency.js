import { isInstance } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Service } from './service.js'

export class Dependency {
    constructor(consumption, service) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        this.consumption = consumption
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        this.failures = []
    }
    
    addNewFailure() {
        this.failures.push(new Failure(this))
    }
    
    toString() {
        return `${this.consumption} --> ${this.service}`
    }
}