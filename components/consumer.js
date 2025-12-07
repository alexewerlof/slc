import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInArr, isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Lint } from './lint.js'
import { Task } from './task.js'

export class Consumer extends Entity {
    static possibleTypes = ['System', 'Component', 'Group']
    _type = Consumer.possibleTypes[0]
    assessment = null
    tasks = new SelectableArray(Task, this)

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

    set state(newState) {
        super.state = newState

        const { type, tasks } = newState

        if (isDef(type)) {
            if (!isInArr(type, Consumer.possibleTypes)) {
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

    set type(val) {
        if (!isInArr(val, Consumer.possibleTypes)) {
            throw new Error(`Consumer.type must be one of ${Consumer.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    get type() {
        return this._type
    }

    onRemove() {
        for (const task of this.tasks) {
            task.onRemove()
        }
    }

    addTask(task) {
        if (!isInstance(task, Task)) {
            throw new Error(`Task must be an instance of Task. Got ${task}`)
        }
        task.consumer = this
        this.tasks.push(task)
        return task
    }

    addNewTask(title, description) {
        return this.addTask(new Task(this, title, description))
    }

    remove() {
        return this.assessment.consumers.remove(this)
    }

    toString() {
        return this.markdownId
    }

    get index() {
        return this.assessment.consumers.indexOf(this)
    }

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
