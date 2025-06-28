import { unicodeSymbol } from '../lib/icons.js'
import { isDef, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { config } from '../config.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Task extends Entity {
    consumer = null
    displayName = config.displayName.default
    description = config.description.default

    constructor(consumer, state) {
        super()
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Task.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        if (isObj(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            id: this.id,
            displayName: this.displayName,
            description: this.description,
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
    }

    get dependencies() {
        return this.consumer.assessment.dependencies.filter(
            (dependency) => dependency.task === this,
        )
    }

    onRemove() {
        const { dependencies } = this.consumer.assessment
        for (let i = dependencies.length - 1; i >= 0; i--) {
            if (dependencies[i].task === this) {
                dependencies[i].remove()
            }
        }
    }

    get displayNameWithFallback() {
        return this.displayName || this.id
    }

    toString() {
        return `${this.consumer.displayNameWithFallback}${scopeIcon}${this.displayNameWithFallback}`
    }

    get index() {
        return this.consumer.tasks.indexOf(this)
    }

    remove() {
        return this.consumer.tasks.remove(this)
    }

    get lint() {
        const lint = new Lint()
        const { assessment } = this.consumer
        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }
        if (assessment.providers.length === 0) {
            lint.info(
                'There are currently no service **providers** declared to consume.',
                'Please add some service providers first.',
            )
        } else if (assessment.services.length === 0) {
            lint.info(
                'There are currently no **service** declared to consume.',
                'Please add some services to the providers so that the task can depend on them.',
            )
        }
        if (this.dependencies.length === 0) {
            lint.warn(
                'This task does not depend on any services which effectively makes it pointless in this assessment.',
                'Please declare some dependencies to services.',
            )
        }
        return lint
    }
}
