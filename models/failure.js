import { isInstance } from '../lib/validation.js'
import { Dependency } from './dependency.js'
import { Risk } from './risk.js'

// If a certain service fails, what activities will it impact and how?
export class Failure {
    constructor(dependency, symptom = '', consequence = '', businessImpact = '') {
        if (!isInstance(dependency, Dependency)) {
            throw new Error(`Expected a Service instance. Got ${service}`)
        }
        this.dependency = dependency        
        this.symptom = symptom
        this.consequence = consequence
        this.risk = new Risk(this, businessImpact)
    }

    toString() {
        return `${this.dependency.consumption} ⇸ ${this.dependency.service} ⇒ ${this.symptom}`
    }
}