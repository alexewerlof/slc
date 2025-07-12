import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isObj, isStr } from '../lib/validation.js'
import { Task } from './task.js'
import { Failure } from './failure.js'
import { Lint } from './lint.js'
import { Service } from './service.js'

export class Usage extends Entity {
    task
    failures = new SelectableArray(Failure, this)

    constructor(service, state) {
        super('u')
        if (!isInstance(service, Service)) {
            throw TypeError(`Expected an instance of service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    get state() {
        return {
            id: this.id,
            taskId: this.task.id,
            failures: this.failures.map((failure) => failure.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const { id, taskId, failures } = newState

        if (isDef(id)) {
            this.id = id
        }

        if (!isStr(taskId)) {
            throw new TypeError(`Invalid taskId: ${taskId} (${typeof taskId})`)
        }

        this.task = this.assessment.tasks.find((task) => task.id === taskId)
        if (!isInstance(this.task, Task)) {
            throw TypeError(`No task found with id ${taskId}.`)
        }
        if (isDef(failures)) {
            if (!isArr(failures)) {
                throw new TypeError(`Invalid failures: ${failures} (${typeof failures})`)
            }
            this.failures.state = failures
        }
    }

    onRemove() {
        this.failures.forEach((failure) => failure.onRemove())
        this.failures.removeAll()
    }

    toString() {
        return [this.task.markdownId, this.service.markdownId].join(this.icon)
    }

    get markdownDisplayName() {
        return [this.service.markdownDisplayName, this.task.markdownDisplayName].join(' ')
    }

    get provider() {
        return this.service.provider
    }

    get assessment() {
        return this.provider.assessment
    }

    get index() {
        return this.service.usages.indexOf(this)
    }

    remove() {
        this.service.usages.remove(this)
    }

    get lint() {
        const lint = new Lint()
        if (this.failures.length === 0) {
            lint.warn(
                'No **failures** are identified for this dependency which effectively makes it pointless for this assessment.',
                'Please declare some failures.',
            )
        }
        return lint
    }
}
