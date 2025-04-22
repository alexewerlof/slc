import { Service } from './service.js'
import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { config } from '../config.js'

export class Provider {
    static possibleTypes = Object.freeze(['System', 'Component', 'Group'])

    assessment = null
    displayName = config.displayName.default
    description = config.description.default
    type = Provider.possibleTypes[0]

    services = new SelectableArray(Service, this)

    constructor(assessment, state) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Provider.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            displayName: this.displayName,
            description: this.description,
            type: this.type,
            services: this.services.map((service) => service.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`Invalid options: ${newState} (${typeof newState})`)
        }
        const {
            displayName,
            description,
            type,
            services,
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
            if (!isInArr(type, Provider.possibleTypes)) {
                throw new TypeError(`Invalid type. ${type}`)
            }
            this.type = type
        }
        if (isDef(services)) {
            if (!Array.isArray(services)) {
                throw new TypeError(`Invalid services: ${services} (${typeof services})`)
            }
            this.services.state = services
        }
    }

    set type(val) {
        if (!isInArr(val, Provider.possibleTypes)) {
            throw new Error(`Provider.type must be one of ${Provider.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    toString() {
        return this.displayName
    }

    get ref() {
        return this.assessment.systems.indexOf(this)
    }
}
