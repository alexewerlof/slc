import { icon } from '../lib/icons.js'
import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Provider } from './provider.js'
import { config } from '../config.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Metric } from './metric.js'
import { Dependency } from './dependency.js'

const scopeIcon = icon('scope')

export class Service {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
    dependencies = new SelectableArray(Dependency, this)
    metrics = new SelectableArray(Metric, this)
    _type = Service.possibleTypes[0]

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
            dependencies,
            metrics,
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
        if (isDef(dependencies)) {
            this.dependencies.state = dependencies
        }
        if (isDef(metrics)) {
            this.metrics.state = metrics
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

    onRemove() {
        const { dependencies } = this.provider.assessment
        for (let i = dependencies.length - 1; i >= 0; i--) {
            if (dependencies[i].service === this) {
                dependencies.removeIndex(i)
            }
        }
    }

    get dependencies() {
        return this.provider.assessment.dependencies.filter((d) => d.service === this)
    }

    get consumptions() {
        return this.dependencies.map((d) => d.consumption)
    }

    get failures() {
        return this.dependencies.flatMap((d) => d.failures)
    }

    isConsumedBy(consumption) {
        return this.dependencies.some((d) => d.consumption === consumption)
    }

    setConsumedBy(consumption, value) {
        if (value) {
            if (!this.isConsumedBy(consumption)) {
                this.dependencies.push(
                    new Dependency(this, {
                        consumptionRef: [consumption.consumer.index, consumption.index],
                    }),
                )
            }
        } else {
            const idx = this.dependencies.findIndex((d) => d.consumption === consumption)
            if (idx !== -1) {
                this.dependencies.removeIndex(idx)
            }
        }
    }

    toString() {
        const thisDisplayName = this.displayName || `Service #${this.index}`
        return `${this.provider.displayName}${scopeIcon}${thisDisplayName}`
    }

    get index() {
        return this.provider.services.indexOf(this)
    }
}
