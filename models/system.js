import { Service } from './service.js'
import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'

export class System {
    constructor(assessment, displayName = '', description = '') {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`System.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.displayName = displayName
        this.description = description
        this.services = []
    }

    addService(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Service must be an instance of Service. Got ${service}`)
        }
        service.system = this
        this.services.push(service)
        return service
    }

    addNewService(displayName, description) {
        return this.addService(new Service(this, displayName, description))
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
        return this.displayName
    }

    toJSON() {
        return osloObj('System', osloMetadata(undefined, this.displayName), {
            description: this.description,
            services: this.services,
        })
    }
}