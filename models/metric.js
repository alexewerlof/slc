import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'

export class Metric {
    constructor(service, title = '', description = '', ...failures) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        this.title = title
        this.description = description
        for (const failure of failures) {
            if (!isInstance(failure, Failure)) {
                throw new Error(`Expected failures to be instances of Failure. Got ${failure}`)
            }
        }
        this.failures = failures
    }

    toString() {
        return `${ this.service }::${this.title} (${ this.failures.length })`
    }
}