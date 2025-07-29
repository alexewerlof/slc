import { isArr, isBool, isDef, isInArr, isInstance } from '../lib/validation.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Condition } from './condition.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Metric extends Entity {
    service = null
    isBoolean = false
    numericUnit = ''
    condition = new Condition(this)
    linkedFailures = []

    constructor(service, state) {
        super('m', true)
        if (!isInstance(service, Service)) {
            throw new Error(`Expected an instance of Service. Got ${service}`)
        }
        this.service = service
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        const ret = super.state

        if (this.isBoolean) {
            ret.isBoolean = this.isBoolean
        }
        if (this.numericUnit) {
            ret.numericUnit = this.numericUnit
        }
        if (this.linkedFailures.length) {
            ret.failureIds = this.linkedFailures.map((failure) => failure.id)
        }

        return ret
    }

    set state(newState) {
        super.state = newState

        const {
            isBoolean,
            numericUnit,
            failureIds,
        } = newState

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
        if (isDef(failureIds)) {
            if (!isArr(failureIds)) {
                throw new TypeError(`Invalid failureIds. ${failureIds}`)
            }
            this.linkedFailures.length = 0
            for (const failure of this.service.failures) {
                if (failureIds.includes(failure.id)) {
                    this.linkedFailures.push(failure)
                }
            }
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

    remove() {
        return this.service.metrics.remove(this)
    }

    toString() {
        return [this.service.markdownId, this.markdownId].join(scopeIcon)
    }

    get index() {
        return this.service.metrics.indexOf(this)
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
        if (this.service.usages.length === 0) {
            lint.warn(
                'No consumer **uses** the service that this metric is measuring.',
                'Please declare a usage before trying to set a metric.',
            )
        }
        return lint
    }
}
