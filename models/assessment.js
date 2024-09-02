import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { Dependency } from './dependency.js'

export class Assessment {
    constructor() {
        this.systems = []
        this.consumers = []
        this.dependencies = []
        this.failures = []
    }
    
    get allServices() {
        return this.systems.flatMap(system => system.services)
    }
    
    get allConsumptions() {
        return this.consumers.flatMap(consumer => consumer.consumptions)
    }

    addSystem(system) {
        if (!isInstance(system, System)) {
            throw new Error(`Expected an instance of System. Got ${system}`)
        }
        system.assessment = this
        this.systems.push(system)
    }
    
    addNewSystem(title, description) {
        this.systems.push(new System(this, title, description))
    }

    addConsumer(consumer) {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Expected an instance of Consumer. Got ${consumer}`)
        }
        consumer.assessment = this
        this.consumers.push(consumer)
    }
    
    addNewConsumer(title, description) {
        this.consumers.push(new Consumer(this, title, description))
    }

    _dependencyPredicate(consumption, service) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        if (consumption.consumer.assessment !== this) {
            throw new Error(`Consumption ${consumption} is not in the same assessment as ${this}`)
        }
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        if (service.system.assessment !== this) {
            throw new Error(`Service ${service} is not in the same assessment as ${this}`)
        }
        return function AssessmentDependencyPredicate(dependency) {
            return dependency.consumption === consumption && dependency.service === service
        }
    }

    getDependency(consumption, service) {
        return this.dependencies.find(this._dependencyPredicate(consumption, service))
    }

    addDependency(consumption, service) {
        if (!this.getDependency(consumption, service)) {
            this.dependencies.push(new Dependency(consumption, service))
        }
    }

    removeDependency(consumption, service) {
        const index = this.dependencies.findIndex(this._dependencyPredicate(consumption, service))
        if (index > -1) {
            this.dependencies.splice(index, 1)
        } else {
            throw new ReferenceError(`Dependency ${consumption} --> ${service} not found in ${this}`)
        }
    }

    setDependency(consumer, service, value) {
        if (value) {
            this.addDependency(consumer, service)
        } else {
            this.removeDependency(consumer, service)
        }
    }
    
    addNewFailure(service, consumption) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        this.failures.push(new Failure(service, consumption))
    }
}