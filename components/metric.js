import { isArr, isBool, isDef, inArr, isInstance } from '../dependencies/jty.js'
import { Service } from './service.js'
import { Failure } from './failure.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Condition } from './condition.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Metric extends Entity {
    /** @type {import('./service.js').Service | null} */
    service = null
    isBoolean = false
    numericUnit = ''
    condition = new Condition(this)
    linkedFailures = []

    /**
     * Creates a new Metric instance.
     * @param {import('./service.js').Service} service The service this metric belongs to.
     * @param {Object} [state] Optional serialized state to restore.
     */
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

    /**
     * Returns the serialisable state of this Metric.
     * @returns {Object}
     */
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

    /**
     * Restores the Metric from a serialized state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { isBoolean, numericUnit, failureIds } = newState

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

    /**
     * The unit label: the numeric unit when numeric, or "True/False" when boolean.
     * @returns {string}
     */
    get unit() {
        return this.isNumeric ? this.numericUnit : 'True/False'
    }

    /**
     * Whether this metric uses numeric (non-boolean) values.
     * @returns {boolean}
     */
    get isNumeric() {
        return !this.isBoolean
    }

    /**
     * Toggles between numeric and boolean metric mode.
     * @param {boolean} value
     */
    set isNumeric(value) {
        this.isBoolean = !value
    }

    /**
     * Returns whether the given failure is linked to this metric.
     * @param {import('./failure.js').Failure} failure
     * @returns {boolean}
     */
    isFailureLinked(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        return inArr(failure, this.linkedFailures)
    }

    /**
     * Links a failure to this metric (no-op if already linked).
     * @param {import('./failure.js').Failure} failure
     */
    linkFailure(failure) {
        if (!isInstance(failure, Failure)) {
            throw new Error(`Expected an instance of Failure. Got ${failure}`)
        }
        if (!this.isFailureLinked(failure)) {
            this.linkedFailures.push(failure)
        }
    }

    /**
     * Unlinks a failure from this metric.
     * @param {import('./failure.js').Failure} failure
     */
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

    /**
     * Links or unlinks a failure based on the boolean value.
     * @param {import('./failure.js').Failure} failure
     * @param {boolean} value True to link, false to unlink.
     */
    setFailure(failure, value) {
        if (value) {
            return this.linkFailure(failure)
        } else {
            return this.unLinkFailure(failure)
        }
    }

    /**
     * Removes this metric from the service.
     * @returns {import('../lib/selectable-array.js').SelectableArray}
     */
    remove() {
        return this.service.metrics.remove(this)
    }

    /**
     * @returns {string}
     */
    toString() {
        return [this.service.markdownId, this.markdownId].join(scopeIcon)
    }

    /**
     * Index of this metric within the service's metrics array.
     * @returns {number}
     */
    get index() {
        return this.service.metrics.indexOf(this)
    }

    /**
     * Returns lint results for this metric.
     * @returns {import('./lint.js').Lint}
     */
    get lint() {
        const lint = new Lint()

        if (this.displayName.length === 0) {
            lint.error(`Please add the metric name`)
        }

        if (this.service.usages.length === 0) {
            lint.info(
                'No consumer **uses** the service that this metric is measuring.',
                'Please declare a usage before trying to set a metric.',
            )
        } else if (this.linkedFailures.length === 0) {
            lint.warn(
                'This metric is not measuring any **failure** which makes it a poor choice for SLI.',
                'Please connect this metric to some failures.',
            )
        }

        return lint
    }
}
