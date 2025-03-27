import { Provider } from './provider.js'
import { Consumer } from '../models/consumer.js'
import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'

export class Assessment {
    constructor() {
        this.providers = []
        this.consumers = []
    }

    get allServices() {
        return this.providers.flatMap((provider) => provider.services)
    }

    get allConsumptions() {
        return this.consumers.flatMap((consumer) => consumer.consumptions)
    }

    get allFailures() {
        return this.allServices.flatMap((service) => service.failures)
    }

    get allMetrics() {
        return this.allServices.flatMap((service) => service.metrics)
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

    addProvider(provider) {
        if (!isInstance(provider, Provider)) {
            throw new Error(`Expected an instance of Provider. Got ${provider}`)
        }
        provider.assessment = this
        this.providers.push(provider)
        return provider
    }

    addNewProvider(title, description) {
        return this.addProvider(new Provider(this, title, description))
    }

    removeProvider(provider) {
        if (!isInstance(provider, Provider)) {
            throw new Error(`Expected an instance of Provider. Got ${provider}`)
        }
        const index = this.providers.indexOf(provider)
        if (index === -1) {
            return false
        }
        this.providers.splice(index, 1)
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
            providers: this.providers,
            consumers: this.consumers,
        }
    }

    save() {
        return {
            providers: this.providers.map((provider) => provider.save()),
            consumers: this.consumers.map((consumer) => consumer.save()),
        }
    }

    static load(assessmentObj) {
        const newAssessment = new Assessment()
        for (const consumer of assessmentObj.consumers) {
            newAssessment.addConsumer(Consumer.load(newAssessment, consumer))
        }
        for (const provider of assessmentObj.providers) {
            newAssessment.addProvider(Provider.load(newAssessment, provider))
        }

        return newAssessment
    }
}
