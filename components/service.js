import { icon } from '../lib/icons.js'
import { isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Provider } from './provider.js'
import { config } from '../config.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Metric } from './metric.js'
import { Dependency } from './dependency.js'
import { Identifiable } from '../lib/identifiable.js'
import { Lint } from './lint.js'

const scopeIcon = icon('scope')

export class Service extends Identifiable {
    static possibleTypes = ['Automated', 'Manual', 'Hybrid']
    provider = null
    displayName = config.displayName.default
    description = config.description.default
    dependencies = new SelectableArray(Dependency, this)
    metrics = new SelectableArray(Metric, this)
    _type = Service.possibleTypes[0]

    constructor(provider, state) {
        super()
        if (!isInstance(provider, Provider)) {
            throw new Error(`Service.constructor: provider must be an instance of Provider. Got ${provider}`)
        }
        this.provider = provider
        if (isDef(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            id: this.id,
            displayName: this.displayName,
            description: this.description,
            type: this.type,
            dependencies: this.dependencies.state,
            metrics: this.metrics.state,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }
        const {
            id,
            displayName,
            description,
            type,
            dependencies,
            metrics,
        } = newState

        if (isDef(id)) {
            this.id = id
        }

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

        if (isDef(dependencies)) {
            this.dependencies.state = dependencies
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
        const { dependencies } = this.provider.assessment
        for (let i = dependencies.length - 1; i >= 0; i--) {
            if (dependencies[i].service === this) {
                dependencies.removeIndex(i)
            }
        }
    }

    get dependencies() {
        return this.provider.assessment.dependencies.filter((d) => d.service === this)
    }

    get tasks() {
        return this.dependencies.map((d) => d.task)
    }

    get failures() {
        return this.dependencies.flatMap((d) => d.failures)
    }

    isConsumedBy(task) {
        return this.dependencies.some((d) => d.task === task)
    }

    setConsumedBy(task, value) {
        if (value) {
            if (!this.isConsumedBy(task)) {
                this.dependencies.push(
                    new Dependency(this, {
                        taskId: task.id,
                    }),
                )
            }
        } else {
            const idx = this.dependencies.findIndex((d) => d.task === task)
            if (idx !== -1) {
                this.dependencies.removeIndex(idx)
            }
        }
    }

    get displayNameWithFallback() {
        return this.displayName || this.id
    }

    toString() {
        return `${this.provider.displayNameWithFallback}${scopeIcon}${this.displayNameWithFallback}`
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
        if (this.dependencies.length === 0) {
            lint.warn(
                'No tasks depend on this service.',
                'Please select some tasks or add new ones.',
            )
        } else if (this.failures.length === 0) {
            lint.warn(
                'No failure is identified for any of the dependencies.',
                'Please select a dependency and declare some failures',
            )
        } else if (this.metrics.length === 0) {
            lint.warn(
                'This service has no metrics associated with it',
                'Please add some metrics.',
            )
        }
        return lint
    }
}
