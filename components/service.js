import { unicodeSymbol } from '../lib/icons.js'
import { isDef, isInArr, isInstance } from '../lib/validation.js'
import { Provider } from './provider.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Metric } from './metric.js'
import { Usage } from './usage.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Service extends Entity {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    /** @type {import('./provider.js').Provider | null} */
    provider = null
    usages = new SelectableArray(Usage, this)
    metrics = new SelectableArray(Metric, this)
    _type = Service.possibleTypes[0]

    /**
     * Creates a new Service instance.
     * @param {import('./provider.js').Provider} provider The provider that offers this service.
     * @param {Object} [state] Optional serialized state to restore.
     */
    constructor(provider, state) {
        super('s', true)
        if (!isInstance(provider, Provider)) {
            throw new Error(`Service.constructor: provider must be an instance of Provider. Got ${provider}`)
        }
        this.provider = provider
        if (isDef(state)) {
            this.state = state
        }
    }

    /**
     * Returns the serialisable state of this Service.
     * @returns {Object}
     */
    get state() {
        const ret = super.state

        if (this.type) {
            ret.type = this.type
        }
        if (this.usages.length) {
            ret.usages = this.usages.state
        }
        if (this.metrics.length) {
            ret.metrics = this.metrics.state
        }

        return ret
    }

    /**
     * Restores the Service from a serialized state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { type, usages, metrics } = newState

        if (isDef(type)) {
            if (!isInArr(type, Service.possibleTypes)) {
                throw new TypeError(`Invalid type. ${type}`)
            }
            this.type = type
        }

        if (isDef(usages)) {
            this.usages.state = usages
        }

        if (isDef(metrics)) {
            this.metrics.state = metrics
        }
    }

    /**
     * Sets the service type.
     * @param {string} val One of {@link Service.possibleTypes}.
     */
    set type(val) {
        if (!isInArr(val, Service.possibleTypes)) {
            throw new Error(`Service.type must be one of ${Service.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    /**
     * The service type.
     * @returns {string}
     */
    get type() {
        return this._type
    }

    /**
     * Called before this service is removed. Cleans up all child metrics and usages.
     */
    onRemove() {
        this.metrics.removeAll()
        this.usages.removeAll()
    }

    /**
     * All tasks that use this service (via usages).
     * @returns {import('./task.js').Task[]}
     */
    get tasks() {
        return this.usages.map((d) => d.task)
    }

    /**
     * All failures across all usages of this service.
     * @returns {import('./failure.js').Failure[]}
     */
    get failures() {
        return this.usages.flatMap((d) => d.failures)
    }

    /**
     * Returns whether this service is consumed by the given task.
     * @param {import('./task.js').Task} task
     * @returns {boolean}
     */
    isConsumedBy(task) {
        return this.usages.some((d) => d.task === task)
    }

    /**
     * Adds or removes a usage linking this service to the given task.
     * @param {import('./task.js').Task} task
     * @param {boolean} value True to link, false to unlink.
     */
    setConsumedBy(task, value) {
        if (value) {
            if (!this.isConsumedBy(task)) {
                this.usages.push(
                    new Usage(this, {
                        taskId: task.id,
                    }),
                )
            }
        } else {
            const idx = this.usages.findIndex((d) => d.task === task)
            if (idx !== -1) {
                this.usages.removeIndex(idx)
            }
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        return [this.provider.markdownId, this.markdownId].join(scopeIcon)
    }

    /**
     * Index of this service within the provider's services array.
     * @returns {number}
     */
    get index() {
        return this.provider.services.indexOf(this)
    }

    /**
     * Removes this service from the provider.
     * @returns {import('../lib/selectable-array.js').SelectableArray}
     */
    remove() {
        return this.provider.services.remove(this)
    }

    /**
     * Returns lint results for this service.
     * @returns {import('./lint.js').Lint}
     */
    get lint() {
        const lint = new Lint()

        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }

        if (this.usages.length === 0) {
            lint.warn('No tasks depend on this service.', 'Please select some tasks or add new ones.')
        } else if (this.failures.length === 0) {
            lint.warn(
                'No failure is identified for any of the usages.',
                'Please select a usage and declare some failures',
            )
        } else if (this.failures.some((failure) => failure.metrics.length === 0)) {
            lint.warn(
                'Some Service Failures are not associated with any Metrics.',
                'Please associate all failures with some metric that can detect them.',
            )
        } else if (this.metrics.length === 0) {
            lint.warn('This service has no metrics detecting its failures.', 'Please add some metrics.')
        }

        return lint
    }
}
