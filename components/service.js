import { namify } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { crdObj, metadataObj } from '../lib/crd.js'
import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Failure } from './failure.js'
import { Metric } from './metric.js'
import { Provider } from './provider.js'
import { config } from '../config.js'

const scopeIcon = icon('scope')

export class Service {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
    type = Service.possibleTypes[0]
    failures = []
    metrics = []
    constructor(provider, state) {
        if (!isInstance(provider, Provider)) {
            throw new Error(`Service.constructor: provider must be an instance of Provider. Got ${provider}`)
        }
        this.provider = provider
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            displayName: this.displayName,
            description: this.description,
            type: this.type,
            //failures: this.failures.map((failure) => failure.state),
            //metrics: this.metrics.map((metric) => metric.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }
        const {
            displayName,
            description,
            type,
        } = newState
        if (isDef(displayName)) {
            if (!isStrLen(displayName, config.displayName.minLength, config.displayName.maxLength)) {
                throw new TypeError(`Invalid displayName. ${displayName}`)
            }
            this.displayName = displayName
        }
        if (isDef(description)) {
            if (!isStrLen(description, config.description.minLength, config.description.maxLength)) {
                throw new TypeError(`Invalid description. ${description}`)
            }
            this.description = description
        }
        if (isDef(type)) {
            if (!isInArr(type, Service.possibleTypes)) {
                throw new TypeError(`Invalid type. ${type}`)
            }
            this.type = type
        }
    }

    set type(val) {
        if (!isInArr(val, Service.possibleTypes)) {
            throw new Error(`Service.type must be one of ${Service.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    get consumptions() {
        const set = new Set(this.failures.map((failure) => failure.consumption))
        return Array.from(set)
    }

    remove() {
        this.provider.removeService(this)
    }

    get failuresByRisk() {
        return this.failures.sort((f1, f2) => f2.impactLevel - f1.impactLevel)
    }

    addFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        failure.service = this
        this.failures.push(failure)
        return failure
    }

    addNewFailure(consumption, symptom, consequence, businessImpact, impactLevel) {
        return this.addFailure(new Failure(this, consumption, symptom, consequence, businessImpact, impactLevel))
    }

    removeFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        const index = this.failures.indexOf(failure)
        if (index === -1) {
            return false
        }
        this.failures.splice(index, 1)
        for (const metric of this.metrics) {
            metric.unLinkFailure(failure)
        }
        return true
    }

    isConsumedBy(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        return this.failures.some((f) => f.consumption === consumption)
    }

    getConsumptionFailures(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Expected an instance of Consumption. Got ${consumption}`)
        }
        return this.failures.filter((f) => f.consumption === consumption)
    }

    getConsumptionFailureMaxImpactLevel(consumption) {
        const failures = this.getConsumptionFailures(consumption)
        if (failures.length === 0) {
            return 0
        }
        return Math.max(...failures.map((f) => f.impactLevel))
    }

    addConsumption(consumption) {
        if (this.isConsumedBy(consumption)) {
            return false
        }
        this.addNewFailure(consumption)
        return true
    }

    removeConsumption(consumption) {
        let removeCount = 0
        for (let i = this.failures.length - 1; i >= 0; i--) {
            if (this.failures[i].consumption === consumption) {
                removeCount++
                this.failures.splice(i, 1)
            }
        }
        return removeCount
    }

    toString() {
        return `${this.provider.displayName}${scopeIcon}${this.displayName}`
    }

    get ref() {
        return this.provider.services.indexOf(this)
    }
}
