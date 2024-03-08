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
    constructor(service, consumption, symptom, consequence, businessImpact) {
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
        this.businessImpact = businessImpact ?? ''
    }

    toString() {
        return `${this.consumption.description} >> ${this.symptom}`
    }
}

class Metric extends ObjectWithId {    
    constructor(risk, name) {
        super()
        this.risk = risk ?? null
        this.name = name ?? ''
    }
}

export const app = createApp({
    data() {
        const systems = []
        const consumers = []
        const failures = []

        const api = new System('API server')
        api.addNewService('Fetch car models')
        api.addNewService('Fetch car prices')
        systems.push(api)

        const fileStorage = new System('File storage')
        fileStorage.addNewService('Store car images')
        fileStorage.addNewService('Store car documents')
        fileStorage.addNewService('Retrieve car documents')
        systems.push(fileStorage)

        const web = new Consumer('Web client')
        web.addNewConsumption('Car catalog page')
        web.addNewConsumption('Car detail page')
        consumers.push(web)

        const mobile = new Consumer('Mobile client')
        mobile.addNewConsumption('Car catalog page')
        mobile.addNewConsumption('Car control')
        consumers.push(mobile)

        console.log('xx', api.services[0])

        const fail1 = new Failure(api.services[0], web.consumptions[0], 'Service is slow', 'User will leave', 'Loss of potential customer')
        const fail2 = new Failure(api.services[1], web.consumptions[1], 'Price is wrong', 'We sell the car with the wrong price', 'Loss of revenue')
        const fail3 = new Failure(fileStorage.services[0], web.consumptions[0], 'Image is missing', 'User will get confused and leave', 'Loss of potential customer')
        const fail4 = new Failure(fileStorage.services[2], web.consumptions[1], 'Document is missing', 'User interest dies out', 'Loss of potential customer')
        
        failures.push(fail1, fail2, fail3, fail4)

        return {
            systems,
            consumers,
            failures,
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
        addNewFailure(consumption, service) {
            this.failures.push(new Failure(service, consumption))
        },
        getFailures(consumption, service) {
            return this.failures.filter(f => f.consumption === consumption && f.service === service)
        },
        failureUp(failure) {
            // move the failure up in the failures array
            const index = this.failures.indexOf(failure)
            if (index > 0) {
                this.failures.splice(index, 1)
                this.failures.splice(index - 1, 0, failure)
            }
        },
        failureDown(failure) {
            // move the failure down in the failures array
            const index = this.failures.indexOf(failure)
            if (index < this.failures.length - 1) {
                this.failures.splice(index, 1)
                this.failures.splice(index + 1, 0, failure)
            }
        },
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