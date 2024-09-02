import { Service } from './service.js'
import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'

export class System {
    constructor(assessment, title = '', description = '') {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`System.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.title = title
        this.description = description
        this.services = []
    }

    addService(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Service must be an instance of Service. Got ${service}`)
        }
        service.system = this
        this.services.push(service)
        console.log(`Added ${service} to system ${this}`)
    }

    addNewService(title, description) {
        this.addService(new Service(this, title, description))
    }

    removeService(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Service must be an instance of Service. Got ${service}`)
        }
        const index = this.services.indexOf(service)
        if (index > -1) {
            this.services.splice(index, 1)
        } else {
            throw new ReferenceError(`Service ${service} not found in system ${this}`)
        }
    }

    toString() {
        return this.title
    }
}