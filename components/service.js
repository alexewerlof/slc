import { icon } from '../lib/icons.js'
import { isArr, isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Provider } from './provider.js'
import { config } from '../config.js'
import { Dependency } from './dependency.js'
import { SelectableArray } from '../lib/selectable-array.js'

const scopeIcon = icon('scope')

export class Service {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
    type = Service.possibleTypes[0]
    dependencies = new SelectableArray(Dependency, this)

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
            dependencies: this.dependencies.state,
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
            if (!isArr(dependencies)) {
                throw new TypeError(`Invalid dependencies. ${dependencies}`)
            }
            this.dependencies.state = dependencies
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
        return this.dependencies.map((d) => d.consumption)
    }

    getDependency(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new TypeError(`consumption must be an instance of Consumption. Got ${consumption}`)
        }
        return this.dependencies.find((d) => d.consumption === consumption)
    }

    isConsumedBy(consumption) {
        return this.getDependency(consumption) !== undefined
    }

    addDependency(consumption) {
        if (!this.isConsumedBy(consumption)) {
            this.dependencies.push(
                new Dependency(this, {
                    consumptionIndex: consumption.index,
                    consumerIndex: consumption.consumer.index,
                }),
            )
        }
    }

    removeDependency(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new TypeError(`consumption must be an instance of Consumption. Got ${consumption}`)
        }
        const index = this.dependencies.findIndex((d) => d.consumption === consumption)
        if (index !== -1) {
            this.dependencies.splice(index, 1)
        }
    }

    setConsumedBy(consumption, value) {
        if (value) {
            this.addDependency(consumption)
        } else {
            this.removeDependency(consumption)
        }
    }

    toString() {
        return `${this.provider.displayName}${scopeIcon}${this.displayName}`
    }

    get ref() {
        return this.provider.services.indexOf(this)
    }
}
