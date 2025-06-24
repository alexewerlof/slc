import { icon } from '../lib/icons.js'
import { Identifiable } from '../lib/identifiable.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isObj, isStr } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Lint } from './lint.js'
import { Service } from './service.js'

export class Dependency extends Identifiable {
    consumption
    failures = new SelectableArray(Failure, this)

    constructor(service, state) {
        super()
        if (!isInstance(service, Service)) {
            throw TypeError(`Expected an instance of service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    get state() {
        return {
            consumptionId: this.consumption.id,
            failures: this.failures.map((failure) => failure.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const { consumptionId, failures } = newState

        if (!isStr(consumptionId)) {
            throw new TypeError(`Invalid consumptionId: ${consumptionId} (${typeof consumptionId})`)
        }

        this.consumption = this.assessment.consumptions.find((consumption) => consumption.id === consumptionId)
        if (!isInstance(this.consumption, Consumption)) {
            throw TypeError(`No consumption found with id ${consumptionId}.`)
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

    remove() {
        this.service.dependencies.remove(this)
    }

    get lint() {
        const lint = new Lint()
        if (this.failures.length === 0) {
            lint.warn(
                'No **failures** are identified for this dependency which effectively makes it pointless for this assessment.',
                'Please declare some failures.',
            )
        }
        return lint
    }
}
