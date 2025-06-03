import { icon } from '../lib/icons.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Service } from './service.js'

export class Dependency {
    failures = new SelectableArray(Failure, this)

    constructor(service, state) {
        if (!isInstance(service, Service)) {
            throw TypeError(`Expected an instance of service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    get state() {
        return {
            consumptionRef: [this.consumption.consumer.index, this.consumption.index],
            failures: this.failures.map((failure) => failure.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const { consumptionRef, failures } = newState

        if (!isArr(consumptionRef) || consumptionRef.length !== 2) {
            throw new TypeError(`Invalid consumptionRef: ${consumptionRef} (${typeof consumptionRef})`)
        }

        const [consumerIndex, consumptionIndex] = consumptionRef

        const consumer = this.assessment.consumers[consumerIndex]
        if (!isInstance(consumer, Consumer)) {
            throw TypeError(`Consumer must be an instance of Consumer. Got ${consumer} (index: ${consumerIndex})`)
        }

        this.consumption = consumer.consumptions[consumptionIndex]
        if (!isInstance(this.consumption, Consumption)) {
            throw TypeError(
                `Consumption must be an instance of Consumption. Got ${this.consumption} (index: ${consumptionIndex})`,
            )
        }
        if (isDef(failures)) {
            if (!isArr(failures)) {
                throw new TypeError(`Invalid failures: ${failures} (${typeof failures})`)
            }
            this.failures.state = failures
        }
    }

    toString() {
        return `${this.consumption} ${icon('dependency')} ${this.service}`
    }

    get provider() {
        return this.service.provider
    }

    get assessment() {
        return this.provider.assessment
    }

    get index() {
        return this.service.dependencies.indexOf(this)
    }
}
