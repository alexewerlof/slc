import { icon } from '../lib/icons.js'
import { isDef, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { config } from '../config.js'

const scopeIcon = icon('scope')

export class Consumption {
    consumer = null
    displayName = config.displayName.default
    description = config.description.default

    constructor(consumer, state) {
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Consumption.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        if (isObj(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            displayName: this.displayName,
            description: this.description,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }
        const {
            displayName,
            description,
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
    }

    setDependency(service, value) {
        if (value) {
            service.addConsumption(this)
        } else {
            service.removeConsumption(this)
        }
    }

    remove() {
        this.consumer.removeConsumption(this)
    }

    toString() {
        return `${this.consumer.displayName}${scopeIcon}${this.displayName}`
    }

    get index() {
        return this.consumer.consumptions.indexOf(this)
    }
}
