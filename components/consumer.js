import { config } from '../config.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Consumption } from './consumption.js'

export class Consumer {
    static possibleTypes = ['System', 'Component', 'Group']
    displayName = config.displayName.default
    description = config.description.default
    type = Consumer.possibleTypes[0]
    assessment = null
    consumptions = new SelectableArray(Consumption, this)

    constructor(assessment, state) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Consumer.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
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
            consumptions,
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
            if (!isInArr(type, Consumer.possibleTypes)) {
                throw new Error(`Invalid type. ${type}`)
            }
            this.type = type
        }
        if (isDef(consumptions)) {
            if (!isArr(consumptions)) {
                throw new TypeError(`Invalid consumptions. ${consumptions}`)
            }
            this.consumptions.state = consumptions
        }
    }

    set type(val) {
        if (!isInArr(val, Consumer.possibleTypes)) {
            throw new Error(`Consumer.type must be one of ${Consumer.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    addConsumption(consumption) {
        if (!isInstance(consumption, Consumption)) {
            throw new Error(`Consumption must be an instance of Consumption. Got ${consumption}`)
        }
        consumption.consumer = this
        this.consumptions.push(consumption)
        return consumption
    }

    addNewConsumption(title, description) {
        return this.addConsumption(new Consumption(this, title, description))
    }

    removeConsumption(consumption) {
        const index = this.consumptions.indexOf(consumption)
        if (index > -1) {
            this.consumptions.splice(index, 1)
        } else {
            throw new ReferenceError(`Consumption ${consumption} not found in consumer ${this}`)
        }
    }

    remove() {
        return this.assessment.removeConsumer(this)
    }

    toString() {
        return this.displayName
    }

    toJSON() {
        return osloObj('Consumer', osloMetadata(undefined, this.displayName), {
            description: this.description,
            consumptions: this.consumptions,
        })
    }

    get index() {
        return this.assessment.consumers.indexOf(this)
    }
}
