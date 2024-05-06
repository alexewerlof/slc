import { createApp } from '../vendor/vue.js'
import { System, Service } from './provider.js'
import { Consumer, Consumption } from './consumer.js'
import { Failure } from './risk.js'

export const app = createApp({
    data() {
        const systems = []
        const consumers = []
        const failures = []

        const api = new System('API server')
        api.addNewService('Car models API')
        api.addNewService('Car prices API')
        systems.push(api)

        const fileStorage = new System('File storage')
        fileStorage.addNewService('Store car images')
        fileStorage.addNewService('Store car documents')
        fileStorage.addNewService('Retrieve car documents')
        systems.push(fileStorage)

        const web = new Consumer('Web client')
        web.addNewConsumption('Render car catalog page')
        web.addNewConsumption('Render car detail page')
        consumers.push(web)

        const mobile = new Consumer('Mobile client')
        mobile.addNewConsumption('Render car image')
        mobile.addNewConsumption('Control the car remotely')
        consumers.push(mobile)

        failures.push(
            new Failure(
                api.services[0],
                web.consumptions[0],
                'Web page response is slow',
                'User will leave',
                'Loss of potential customer',
                'response time',
                'API',
            ),
            new Failure(
                api.services[0],
                web.consumptions[0],
                'Wrong car specs are shown to the user',
                'User will get the wrong info',
                'Legal responsibility, bad reputation',
                'data correctness',
                'web client',
            ),
            new Failure(
                api.services[1],
                web.consumptions[1],
                'Price is wrong',
                'We sell the car with the wrong price',
                'Loss of revenue',
                'price correctness',
                'API',
            ),
            new Failure(
                fileStorage.services[0],
                web.consumptions[0],
                'Image is missing',
                'User will get confused and leave',
                'Loss of potential customer',
                'number of images that 404',
                'Web client',
            ),
            new Failure(
                fileStorage.services[2],
                web.consumptions[1],
                'Document is missing',
                'User interest dies out',
                'Loss of potential customer',
                'number of documents that 404',
                'Web client',
            ),
        )

        return {
            systems,
            consumers,
            failures,
        }
    },
    methods: {
        setConsumption($event, consumption, service) {
            if ($event.target.checked) {
                // make sure that we have a failure for this service and consumption
                if (!this.hasFailure(consumption, service)) {
                    this.addNewFailure(consumption, service)
                }
            } else {
                // remove any failure that ties to this service and consumption
                this.removeFailures(consumption, service)
            }
        },
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
        hasFailure(consumption, service) {
            return this.filterFailures(consumption, service).length > 0
        },
        addNewFailure(consumption, service) {
            this.failures.push(new Failure(service, consumption))
        },
        removeFailure(failure) {
            const index = this.failures.indexOf(failure)
            if (index > -1) {
                this.failures.splice(index, 1)
            }
        },
        removeFailures(consumption, service) {
            const existingFailures = this.filterFailures(consumption, service)
            for (const failure of existingFailures) {
                this.removeFailure(failure)
            }
        },
        filterFailures(consumption, service) {
            return this.failures.filter(f => f.consumption === consumption && f.service === service)
        },
        filterFailuresBySystem(system) {
            return this.failures.filter(f => f.service.system === system)
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