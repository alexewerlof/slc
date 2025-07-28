import { Service } from './service.js'
import { isArr, isDef, isInArr, isInstance, isStrLen } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { config } from '../config.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

export class Provider extends Entity {
    static possibleTypes = Object.freeze(['System', 'Component', 'Group'])

    assessment = null
    displayName = config.displayName.default
    description = config.description.default
    _type = Provider.possibleTypes[0]

    services = new SelectableArray(Service, this)

    constructor(assessment, state) {
        super('p')
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Provider.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = super.state

        if (this.displayName) {
            ret.displayName = this.displayName
        }
        if (this.description) {
            ret.description = this.description
        }
        if (this.type) {
            ret.type = this.type
        }
        if (this.services.length) {
            ret.services = this.services.map((service) => service.state)
        }

        return ret
    }

    set state(newState) {
        super.state = newState

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
            if (!isArr(services)) {
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

    onRemove() {
        this.services.removeAll()
    }

    toString() {
        return this.markdownId
    }

    get index() {
        return this.assessment.providers.indexOf(this)
    }

    remove() {
        return this.assessment.providers.remove(this)
    }

    get lint() {
        const lint = new Lint()
        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }
        if (this.services.length === 0) {
            lint.warn(
                `This provider is useless for this assessment because it provides no **services**. Please declare some services or remove this provider.`,
            )
        }
        return lint
    }
}
