import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'

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

    get allFailures() {
        return this.allServices.flatMap(service => service.failures)
    }

    get allMetrics() {
        return this.allServices.flatMap(service => service.metrics)
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

    getDependencyCount(consumption, service) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        return service.getConsumptionFailures(consumption).length
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
        return this.addSystem(new System(this, title, description))
    }

    removeSystem(system) {
        if (!isInstance(system, System)) {
            throw new Error(`Expected an instance of System. Got ${system}`)
        }
        const index = this.systems.indexOf(system)
        if (index === -1) {
            return false
        }
        this.systems.splice(index, 1)
        return true
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
        return this.addConsumer(new Consumer(this, title, description))
    }

    removeConsumer(consumer) {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Expected an instance of Consumer. Got ${consumer}`)
        }
        const index = this.consumers.indexOf(consumer)
        if (index === -1) {
            return false
        }
        this.consumers.splice(index, 1)
        return true
    }

    toJSON() {
        return {
            systems: this.systems,
            consumers: this.consumers
        }
    }

    save() {
        return {
            systems: this.systems.map(system => system.save()),
            consumers: this.consumers.map(consumer => consumer.save()),
        }
    }

    static load(assessmentObj) {
        const newAssessment = new Assessment()
        for (const consumer of assessmentObj.consumers) {
            newAssessment.addConsumer(Consumer.load(newAssessment, consumer))
        }
        for (const system of assessmentObj.systems) {
            newAssessment.addSystem(System.load(newAssessment, system))
        }

        return newAssessment
    }

}