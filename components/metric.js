import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { icon } from '../lib/icons.js'
import { Condition } from './condition.js'
import { config } from '../config.js'

const metricIcon = icon('metric')

export class Metric {
    service = null
    displayName = ''
    description = ''
    isBoolean = true
    numericUnit = ''
    condition = new Condition(this)
    linkedFailures = []

    constructor(service, state) {
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            displayName: this.displayName,
            description: this.description,
            isBoolean: this.isBoolean,
            numericUnit: this.numericUnit,
            linkedFailuresIndex: this.linkedFailures.map((failure) => failure.index),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const {
            displayName,
            description,
            isBoolean,
            numericUnit,
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
        if (isDef(isBoolean)) {
            // TODO: validate isBoolean
            this.isBoolean = isBoolean
        }
        if (isDef(numericUnit)) {
            // TODO: validate numericUnit
            this.numericUnit = numericUnit
        }
    }

    get unit() {
        return this.isNumeric ? this.numericUnit : 'True/False'
    }

    get isNumeric() {
        return !this.isBoolean
    }

    set isNumeric(value) {
        this.isBoolean = !value
    }

    isFailureLinked(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        return isInArr(failure, this.linkedFailures)
    }

    linkFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        if (!this.isFailureLinked(failure)) {
            this.linkedFailures.push(failure)
        }
    }

    unLinkFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        const index = this.linkedFailures.indexOf(failure)
        if (index === -1) {
            throw new ReferenceError(`Failure ${failure} not found in metric ${this}`)
        }
        this.linkedFailures.splice(index, 1)
    }

    setFailure(failure, value) {
        if (value) {
            return this.linkFailure(failure)
        } else {
            return this.unLinkFailure(failure)
        }
    }

    toString() {
        return `${this.service} ${metricIcon} ${this.displayName}`
    }

    static load(service, metricObj) {
        const { displayName, description, isBoolean, numericUnit, linkedFailuresIndex } = metricObj
        const newMetric = new Metric(service, displayName, description, isBoolean, numericUnit)

        for (const failureIndex of linkedFailuresIndex) {
            newMetric.linkFailure(service.failures[failureIndex])
        }

        return newMetric
    }
}
