import { ObjectWithId } from './obj-with-id.js'

export class Consumer extends ObjectWithId {
    consumptions = []

    constructor(name) {
        super()
        this.name = name ?? ''
    }

    addNewConsumption(name) {
        this.consumptions.push(new Consumption(this, name))
    }

    removeConsumption(consumption) {
        const index = this.consumptions.indexOf(consumption)
        if (index > -1) {
            this.consumptions.splice(index, 1)
        } else {
            console.warn(`Consumption ${consumption} not found in consumer ${this}`)
        }
    }

    toString() {
        return this.name
    }
}

export class Consumption extends ObjectWithId {
    constructor(consumer, name) {
        super()

        if (!consumer || !(consumer instanceof Consumer)) {
            throw new Error(`Consumption must tie to a consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        
        this.name = name ?? ''
        this.dependencies = []
    }

    hasDependency(service) {
        return this.dependencies.includes(service)
    }

    addDependency(service) {
        if (!this.hasDependency(service)) {
            this.dependencies.push(service)
        }
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.name} -> ${this.name}`
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            dependencies: this.dependencies,
        }
    }
}