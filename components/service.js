import { unicodeSymbol } from '../lib/icons.js'
import { isDef, isInArr, isInstance, isStrLen } from '../lib/validation.js'
import { Provider } from './provider.js'
import { config } from '../config.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Metric } from './metric.js'
import { Usage } from './usage.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Service extends Entity {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
    usages = new SelectableArray(Usage, this)
    metrics = new SelectableArray(Metric, this)
    _type = Service.possibleTypes[0]

    constructor(provider, state) {
        super('s')
        if (!isInstance(provider, Provider)) {
            throw new Error(`Service.constructor: provider must be an instance of Provider. Got ${provider}`)
        }
        this.provider = provider
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
        if (this.usages.length) {
            ret.usages = this.usages.state
        }
        if (this.metrics.length) {
            ret.metrics = this.metrics.state
        }

        return ret
    }

    set state(newState) {
        super.state = newState

        const {
            displayName,
            description,
            type,
            usages,
            metrics,
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

    set type(val) {
        if (!isInArr(val, Service.possibleTypes)) {
            throw new Error(`Service.type must be one of ${Service.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    onRemove() {
        this.metrics.removeAll()
        this.usages.removeAll()
    }

    get usages() {
        return this.provider.assessment.usages.filter((d) => d.service === this)
    }

    get tasks() {
        return this.usages.map((d) => d.task)
    }

    get failures() {
        return this.usages.flatMap((d) => d.failures)
    }

    isConsumedBy(task) {
        return this.usages.some((d) => d.task === task)
    }

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

    toString() {
        return [
            this.provider.markdownId,
            this.markdownId,
        ].join(scopeIcon)
    }

    get index() {
        return this.provider.services.indexOf(this)
    }

    remove() {
        return this.provider.services.remove(this)
    }

    get lint() {
        const lint = new Lint()
        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }
        if (this.usages.length === 0) {
            lint.warn(
                'No tasks depend on this service.',
                'Please select some tasks or add new ones.',
            )
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
            lint.warn(
                'This service has no metrics detecting its failures.',
                'Please add some metrics.',
            )
        }
        return lint
    }
}
