import { unicodeSymbol } from '../lib/icons.js'
import { isInstance, isObj } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

const scopeIcon = unicodeSymbol('scope')

export class Task extends Entity {
    consumer = null

    /**
     * Creates a new Task instance.
     * @param {import('./consumer.js').Consumer} consumer The consumer this task belongs to.
     * @param {Object} [state] Optional serialised state to restore.
     */
    constructor(consumer, state) {
        super('t', true)
        if (!isInstance(consumer, Consumer)) {
            throw new Error(`Task.constructor: consumer must be an instance of Consumer. Got ${consumer}`)
        }
        this.consumer = consumer
        if (isObj(state)) {
            this.state = state
        }
    }

    /**
     * All usages in the assessment that reference this task.
     * @returns {import('./usage.js').Usage[]}
     */
    get usages() {
        return this.consumer.assessment.usages.filter((usage) => usage.task === this)
    }

    /**
     * Called before this task is removed. Cleans up associated usages.
     */
    onRemove() {
        const { usages } = this.consumer.assessment
        for (let i = usages.length - 1; i >= 0; i--) {
            if (usages[i].task === this) {
                usages[i].remove()
            }
        }
    }

    /**
     * @returns {string}
     */
    toString() {
        return [this.consumer.markdownDisplayName, this.markdownDisplayName].join(scopeIcon)
    }

    /**
     * Index of this task within the consumer's tasks array.
     * @returns {number}
     */
    get index() {
        return this.consumer.tasks.indexOf(this)
    }

    /**
     * Removes this task from the consumer.
     * @returns {boolean}
     */
    remove() {
        return this.consumer.tasks.remove(this)
    }

    /**
     * Returns lint results for this task.
     * @returns {import('./lint.js').Lint}
     */
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
