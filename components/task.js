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
        super('t')
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Task.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        if (isObj(state)) {
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

        return ret
    }

    set state(newState) {
        super.state = newState

        const {
            displayName,
            description,
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
    }

    get usages() {
        return this.consumer.assessment.usages.filter(
            (usage) => usage.task === this,
        )
    }

    onRemove() {
        const { usages } = this.consumer.assessment
        for (let i = usages.length - 1; i >= 0; i--) {
            if (usages[i].task === this) {
                usages[i].remove()
            }
        }
    }

    toString() {
        return [
            this.consumer.markdownDisplayName,
            this.markdownDisplayName,
        ].join(scopeIcon)
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
        if (this.usages.length === 0) {
            lint.warn(
                'This task does not use any services which effectively makes it pointless in this assessment.',
                'Please either remove declare some service usage or remove this task.',
            )
        }
        return lint
    }
}
