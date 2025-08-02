import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isStr } from '../lib/validation.js'
import { Task } from './task.js'
import { Failure } from './failure.js'
import { Lint } from './lint.js'
import { Service } from './service.js'

export class Usage extends Entity {
    task
    failures = new SelectableArray(Failure, this)

    constructor(service, state) {
        super('u', false)
        if (!isInstance(service, Service)) {
            throw TypeError(`Expected an instance of service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    get state() {
        const ret = super.state

        if (this.task) {
            ret.taskId = this.task.id
        }
        if (this.failures.length) {
            ret.failures = this.failures.state
        }

        return ret
    }

    set state(newState) {
        super.state = newState

        const { taskId, failures } = newState

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

        if (this.failures.some((failure) => failure.lint.count)) {
            lint.info(`Some failures have issues.`)
        }

        if (this.service.displayName.trim() === '') {
            lint.info('Automatic failure detection is not possible because the service displayName is missing')
        }

        if (this.task.displayName.trim() === '') {
            lint.info('Automatic failure detection is not possible because the task displayName is missing')
        }

        return lint
    }
}
