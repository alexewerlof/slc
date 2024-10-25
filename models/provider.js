import { Service } from './service.js'
import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { osloMetadata, osloObj } from '../lib/oslo.js'

export class Provider {
    static possibleTypes = ['System', 'Component', 'Group']

    constructor(assessment, displayName = '', description = '', type = Provider.possibleTypes[0]) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Provider.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.displayName = displayName
        this.description = description
        this.services = []
        this.type = type
    }

    set type(val) {
        if (!Provider.possibleTypes.includes(val)) {
            throw new Error(`Provider.type must be one of ${Provider.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    addService(service) {
        if (!isInstance(service, Service)) {
            throw new Error(`Service must be an instance of Service. Got ${service}`)
        }
        service.provider = this
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
            throw new ReferenceError(`Service ${service} not found in provider ${this}`)
        }
    }

    remove() {
        return this.assessment.removeProvider(this)
    }

    toString() {
        return this.displayName
    }

    toJSON() {
        return osloObj('Provider', osloMetadata(undefined, this.displayName), {
            description: this.description,
            services: this.services,
        })
    }

    get ref() {
        return this.assessment.systems.indexOf(this)
    }
    
    save() {
        return {
            displayName: this.displayName,
            description: this.description,
            type: this.type,
            services: this.services.map(service => service.save()),
        }
    }

    static load(assessment, providerObj) {
        const newProvider = new Provider(assessment, providerObj.displayName, providerObj.description)
        for (const service of providerObj.services) {
            newProvider.addService(Service.load(newProvider, service))
        }
        return newProvider
    }
}