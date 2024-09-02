import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system.js'
import ConsumerView from '../views/consumer.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'

export class Assessment {
    constructor() {
        this.systems = []
        this.consumers = []
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