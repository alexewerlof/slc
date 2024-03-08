import { createApp } from '../vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'

function uuid() {
    return Math.floor(Math.random() * 100_000_000);
}

class ObjectWithId {
    constructor() {
        this.id = uuid()
    }

    toString() {
        return `Debug: ObjectWithId(${this.id})`
    }
}

class System extends ObjectWithId {
    constructor(name) {
        super()
        this.name = name ?? ''
        this.services = []
    }

    addNewService(description) {
        this.services.push(new Service(this, description))
    }

    removeService(service) {
        const index = this.services.indexOf(service)
        if (index > -1) {
            this.services.splice(index, 1)
        } else {
            console.warn(`Service ${service} not found in system ${this}`)
        }
    }

    toString() {
        return this.name
    }
}

class Service extends ObjectWithId {
    constructor(system, description) {
        super()
        if (!system || !(system instanceof System)) {
            throw new Error(`Service must tie to a system. Got ${system}`)
        }
        this.system = system
        this.description = description ?? ''
    }

    remove() {
        this.service.removeService(this)
    }

    toString() {
        return `${this.system.name} => ${this.description}`
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
        }
    }
}

class Consumer extends ObjectWithId {
    consumptions = []

    constructor(name) {
        super()
        this.name = name ?? ''
    }

    addNewConsumption(description) {
        this.consumptions.push(new Consumption(this, description))
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

class Consumption extends ObjectWithId {
    constructor(consumer, description) {
        super()

        if (!consumer || !(consumer instanceof Consumer)) {
            throw new Error(`Consumption must tie to a consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        
        this.description = description ?? ''
        this.dependencies = []
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.name} -> ${this.description}`
    }

    toJSON() {
        return {
            id: this.id,
            description: this.description,
            dependencies: this.dependencies,
        }
    }
}

// If a certain service fails, what activities will it impact and how?
class Failure extends ObjectWithId {
    constructor(service, consumption, symptom, consequence) {
        super()
        
        if (!service || !(service instanceof Service)) {
            throw new Error(`Failure must tie to a service. Got ${service}`)
        }
        this.service = service

        if (!consumption || !(consumption instanceof Consumption)) {
            throw new Error(`Failure must tie to a consumption. Got ${consumption}`)
        }
        this.consumption = consumption
        
        this.symptom = symptom ?? ''
        this.consequence = consequence ?? ''
    }

    toString() {
        return `${this.consumption.description} >> ${this.symptom}`
    }
}

class Metric extends ObjectWithId {
    static instances = []
    
    constructor(risk, name) {
        super()
        Metric.instances.push(this)
        this.risk = risk ?? null
        this.name = name ?? ''
    }
}

export const app = createApp({
    data() {
        const systems = []
        const consumers = []

        const api = new System('API server')
        api.addNewService('Fetch car models')
        api.addNewService('Fetch car prices')

        systems.push(api)

        const web = new Consumer('Web client')
        web.addNewConsumption('Car catalog page')
        web.addNewConsumption('Car detail page')
        consumers.push(web)

        return {
            systems,
            consumers,
            failures: [],
        }
    },
    methods: {
        addNewSystem() {
            this.systems.push(new System())
        },
        addNewService(system) {
            system.addNewService()
        },
        removeService(service) {
            service.remove()
        },
        addNewConsumer() {
            this.consumers.push(new Consumer())
        },
        addNewConsumption(consumer) {
            consumer.addNewConsumption()
        },
        removeConsumption(consumption) {
            consumption.remove()
        },
        updateFailures() {
            const newFailures = []
            for (const consumption of this.allConsumptions) {
                for (const service of consumption.dependencies) {
                    const failure = this.failures.find(
                        f => f.service === service && f.consumption === consumption
                    )
                    newFailures.push(failure ?? new Failure(service, consumption))
                }
            }
            this.failures.length = 0
            this.failures.push(...newFailures)
        }
    },
    computed: {
        allServices() {
            const ret = []
            for (const system of this.systems) {
                ret.push(...system.services)
            }
            return ret
        },
        allConsumptions() {
            const ret = []
            for (const consumer of this.consumers) {
                ret.push(...consumer.consumptions)
            }
            return ret
        },
        state() {
            return JSON.stringify({
                systems: this.systems,
                consumers: this.consumers,
                failures: this.failures,
            }, null, 2)
        }
    },
})