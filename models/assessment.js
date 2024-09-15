import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'

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

    getRisks(likelihood, impactLevel) {
        if (!config.likelihood.possibleValues.includes(likelihood)) {
            throw new RangeError(`Expected likelihood to be one of ${config.likelihood.possibleValues}. Got ${likelihood}`)
        }
        if (!config.impactLevel.possibleValues.includes(impactLevel)) {
            throw new RangeError(`Expected impactLevel to be one of ${config.impactLevel.possibleValues}. Got ${impactLevel}`)
        }
        return this.allFailures.filter(failure => failure.likelihood === likelihood && failure.impactLevel === impactLevel)
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

    toJSON() {
        return {
            systems: this.systems,
            consumers: this.consumers
        }
    }
}