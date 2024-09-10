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
    }
    
    get allServices() {
        return this.systems.flatMap(system => system.services)
    }
    
    get allConsumptions() {
        return this.consumers.flatMap(consumer => consumer.consumptions)
    }

    get allDependencies() {
        return this.allConsumptions.flatMap(consumption => consumption.dependencies)
    }

    get allFailures() {
        return this.allDependencies.flatMap(dependency => dependency.failures)
    }

    addSystem(system) {
        if (!isInstance(system, System)) {
            throw new Error(`Expected an instance of System. Got ${system}`)
        }
        system.assessment = this
        this.systems.push(system)
        return system
    }
    
    addNewSystem(title, description) {
        return this.systems.push(new System(this, title, description))
    }

    addConsumer(consumer) {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Expected an instance of Consumer. Got ${consumer}`)
        }
        consumer.assessment = this
        this.consumers.push(consumer)
        return consumer
    }
    
    addNewConsumer(title, description) {
        return this.consumers.push(new Consumer(this, title, description))
    }
}