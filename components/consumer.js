import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, inArr, isInstance } from '../dependencies/jty.js'
import { Assessment } from './assessment.js'
import { Lint } from './lint.js'
import { Task } from './task.js'

export class Consumer extends Entity {
    static possibleTypes = ['System', 'Component', 'Group']
    _type = Consumer.possibleTypes[0]
    /** @type {import('./assessment.js').Assessment | null} */
    assessment = null
    tasks = new SelectableArray(Task, this)

    /**
     * Creates a new Consumer instance.
     * @param {import('./assessment.js').Assessment} assessment The assessment this consumer belongs to.
     * @param {Object} [state] Optional serialized state to restore.
     */
    constructor(assessment, state) {
        super('c', true)
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Consumer.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        if (isDef(state)) {
            this.state = state
        }
    }

    /**
     * Returns the serialisable state of this Consumer.
     * @returns {Object}
     */
    get state() {
        const ret = super.state

        if (this.type) {
            ret.type = this.type
        }
        if (this.tasks.length) {
            ret.tasks = this.tasks.state
        }

        return ret
    }

    /**
     * Restores the Consumer from a serialized state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { type, tasks } = newState

        if (isDef(type)) {
            if (!inArr(type, Consumer.possibleTypes)) {
                throw new Error(`Invalid type. ${type}`)
            }
            this.type = type
        }

        if (isDef(tasks)) {
            if (!isArr(tasks)) {
                throw new TypeError(`Invalid tasks. Expected an array. Got: ${tasks}`)
            }
            this.tasks.state = tasks
        }
    }

    /**
     * Sets the consumer type.
     * @param {string} val One of {@link Consumer.possibleTypes}.
     */
    set type(val) {
        if (!inArr(val, Consumer.possibleTypes)) {
            throw new Error(`Consumer.type must be one of ${Consumer.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    /**
     * The consumer type.
     * @returns {string}
     */
    get type() {
        return this._type
    }

    /**
     * Called before this consumer is removed. Cleans up all child tasks.
     */
    onRemove() {
        for (const task of this.tasks) {
            task.onRemove()
        }
    }

    /**
     * Adds an existing Task instance to this consumer.
     * @param {import('./task.js').Task} task
     * @returns {import('./task.js').Task}
     */
    addTask(task) {
        if (!isInstance(task, Task)) {
            throw new Error(`Task must be an instance of Task. Got ${task}`)
        }
        task.consumer = this
        this.tasks.push(task)
        return task
    }

    /**
     * Creates a new Task and adds it to this consumer.
     * @param {string} title
     * @param {string} description
     * @returns {import('./task.js').Task}
     */
    addNewTask(title, description) {
        return this.addTask(new Task(this, title, description))
    }

    /**
     * Removes this consumer from the assessment.
     * @returns {import('../lib/selectable-array.js').SelectableArray}
     */
    remove() {
        return this.assessment.consumers.remove(this)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.markdownId
    }

    /**
     * Index of this consumer within the assessment's consumers array.
     * @returns {number}
     */
    get index() {
        return this.assessment.consumers.indexOf(this)
    }

    /**
     * Returns lint results for this consumer.
     * @returns {import('./lint.js').Lint}
     */
    get lint() {
        const lint = new Lint()

        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }

        if (this.tasks.length === 0) {
            lint.warn(
                'No task is defined for this consumer which effectively makes it pointless for this assessment.',
                'Please declare some tasks or remove the consumer.',
            )
        }

        return lint
    }
}
