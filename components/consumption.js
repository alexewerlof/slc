import { icon } from '../lib/icons.js'
import { isDef, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { config } from '../config.js'
import { Identifiable } from '../lib/identifiable.js'

const scopeIcon = icon('scope')

export class Consumption extends Identifiable {
    consumer = null
    displayName = config.displayName.default
    description = config.description.default

    constructor(consumer, state) {
        super()
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

    get dependencies() {
        return this.consumer.assessment.dependencies.filter(
            (dependency) => dependency.consumption === this,
        )
    }

    onRemove() {
        const { dependencies } = this.consumer.assessment
        for (let i = dependencies.length - 1; i >= 0; i--) {
            if (dependencies[i].consumption === this) {
                dependencies[i].remove()
            }
        }
    }

    get displayNameWithFallback() {
        return this.displayName || `Consumption #${this.index}`
    }

    toString() {
        return `${this.consumer.displayNameWithFallback}${scopeIcon}${this.displayNameWithFallback}`
    }

    get index() {
        return this.consumer.consumptions.indexOf(this)
    }

    remove() {
        return this.consumer.consumptions.remove(this)
    }
}
