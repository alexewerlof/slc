import { config } from '../config.js'
import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInArr, isInstance, isObj, isStrLen } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Task } from './task.js'
import { Lint } from './lint.js'

export class Consumer extends Entity {
    static possibleTypes = ['System', 'Component', 'Group']
    displayName = config.displayName.default
    description = config.description.default
    type = Consumer.possibleTypes[0]
    assessment = null
    tasks = new SelectableArray(Task, this)

    constructor(assessment, state) {
        super('c')
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Consumer.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
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
            tasks: this.tasks.state,
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
            tasks,
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

    removeTask(task) {
        return this.tasks.remove(task)
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
