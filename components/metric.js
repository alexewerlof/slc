import { isArr, isBool, isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { icon } from '../lib/icons.js'
import { Condition } from './condition.js'
import { config } from '../config.js'
import { Dependency } from './dependency.js'
import { Identifiable } from '../lib/identifiable.js'
import { Lint } from './lint.js'

const metricIcon = icon('metric')

export class Metric extends Identifiable {
    service = null
    displayName = ''
    description = ''
    isBoolean = false
    numericUnit = ''
    condition = new Condition(this)
    linkedFailures = []

    constructor(service, state) {
        super()
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
            linkedFailureRefs: this.linkedFailures.map((failure) => failure.ref),
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
            linkedFailureRefs,
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
            if (!isBool(isBoolean)) {
                throw new TypeError(`Invalid isBoolean. ${isBoolean}`)
            }
            this.isBoolean = isBoolean
        }
        if (isDef(numericUnit)) {
            // TODO: validate numericUnit
            this.numericUnit = numericUnit
        }
        if (isDef(linkedFailureRefs)) {
            if (!isArr(linkedFailureRefs)) {
                throw new TypeError(`Invalid linkedFailureRefs. ${linkedFailureRefs}`)
            }
            this.linkedFailures = linkedFailureRefs.map((ref) => this.getFailureFromRef(ref))
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

    getFailureFromRef(ref) {
        if (!isArr(ref) || ref.length !== 2) {
            throw new TypeError(`Invalid failure ref. ${ref}`)
        }
        const [dependencyIndex, failureIndex] = ref
        const dependency = this.service.dependencies[dependencyIndex]
        if (!isInstance(dependency, Dependency)) {
            throw new TypeError(`Invalid dependency. ${dependency}`)
        }
        const failure = dependency.failures[failureIndex]
        if (!isInstance(failure, Failure)) {
            throw new TypeError(`Invalid failure. ${failure}`)
        }
        return failure
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

    remove() {
        return this.service.metrics.remove(this)
    }

    toString() {
        return `${this.service} ${metricIcon} ${this.displayName}`
    }

    get index() {
        return this.service.metrics.indexOf(this)
    }

    static load(service, metricObj) {
        const { displayName, description, isBoolean, numericUnit, linkedFailureRefs } = metricObj
        const newMetric = new Metric(service, displayName, description, isBoolean, numericUnit)

        for (const failureIndex of linkedFailureRefs) {
            newMetric.linkFailure(service.failures[failureIndex])
        }

        return newMetric
    }

    get lint() {
        const lint = new Lint()

        if (this.displayName.length === 0) {
            lint.warn(`Please add the metric name`)
        }

        if (this.linkedFailures.length === 0) {
            lint.warn(
                'This metric is not measuring any **failure** which makes it a poor choice for SLI.',
                'Please connect this metric to some failures.',
            )
        }
        if (this.service.dependencies.length === 0) {
            lint.warn(
                'No consumer **depends** on the service that declares this metric.',
                'Please declare a dependency before trying to set a metric.',
            )
        }
        return lint
    }
}
