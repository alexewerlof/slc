import { icon } from '../lib/icons.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Service } from './service.js'

const consumptionIcon = icon('consumption')

export class Dependency {
    failures = new SelectableArray(Failure, this)

    constructor(service, state) {
        if (!isInstance(service, Service)) {
            throw TypeError(`Service must be an instance of Service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    get state() {
        return {
            consumerIndex: this.consumerIndex,
            consumptionIndex: this.consumptionIndex,
            failures: this.failures.map((failure) => failure.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }
        const { consumerIndex, consumptionIndex, failures } = newState
        const consumer = this.service.provider.assessment.consumers[consumerIndex]
        if (!isInstance(consumer, Consumer)) {
            throw TypeError(`Consumer must be an instance of Consumer. Got ${consumer}`)
        }
        const consumption = consumer.consumptions[consumptionIndex]
        if (!isInstance(consumption, Consumption)) {
            throw TypeError(`Consumption must be an instance of Consumption. Got ${consumption}`)
        }
        this.consumption = consumption
        if (isDef(failures)) {
            if (!isArr(failures)) {
                throw new TypeError(`Invalid failures: ${failures} (${typeof failures})`)
            }
            this.failures.state = failures
        }
    }

    get failuresByRisk() {
        return this.failures.sort((f1, f2) => f2.impactLevel - f1.impactLevel)
    }

    toString() {
        return `${this.consumption} ${consumptionIcon} ${this.service}`
    }
}
