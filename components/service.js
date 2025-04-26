import { icon } from '../lib/icons.js'
import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumption } from './consumption.js'
import { Provider } from './provider.js'
import { config } from '../config.js'
import { Dependency } from './dependency.js'

const scopeIcon = icon('scope')

export class Service {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
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
        return this.dependencies.map((d) => d.consumption)
    }

    isConsumedBy(consumption) {
        return this.provider.assessment.isLinked(this, consumption)
    }

    setConsumedBy(consumption, value) {
        return this.provider.assessment.setLinked(this, consumption, value)
    }

    toString() {
        const thisDisplayName = this.displayName || `Service #${this.index}`
        return `${this.provider.displayName}${scopeIcon}${thisDisplayName}`
    }

    get index() {
        return this.provider.services.indexOf(this)
    }
}
