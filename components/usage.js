import { Entity } from '../lib/entity.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { isArr, isDef, isInstance, isStr } from '../dependencies/jty.js'
import { Task } from './task.js'
import { Failure } from './failure.js'
import { Service } from './service.js'
import { Lint } from './lint.js'

export class Usage extends Entity {
    task
    failures = new SelectableArray(Failure, this)

    /**
     * Creates a new Usage instance linking a service to a task.
     * @param {import('./service.js').Service} service The service being used.
     * @param {Object} state serialized state containing the taskId.
     */
    constructor(service, state) {
        super('u', false)
        if (!isInstance(service, Service)) {
            throw TypeError(`Expected an instance of service. Got ${service}`)
        }
        this.service = service
        this.state = state
    }

    /**
     * Returns the serialisable state of this Usage.
     * @returns {Object}
     */
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

    /**
     * Restores the Usage from a serialized state object.
     * @param {Object} newState
     */
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

    /**
     * Called before this usage is removed. Cleans up all child failures.
     */
    onRemove() {
        this.failures.forEach((failure) => failure.onRemove())
        this.failures.removeAll()
    }

    /**
     * @returns {string}
     */
    toString() {
        return [this.task.markdownId, this.service.markdownId].join(this.icon)
    }

    /**
     * A display name combining the service and task names.
     * @returns {string}
     */
    get markdownDisplayName() {
        return [this.service.markdownDisplayName, this.task.markdownDisplayName].join(' ')
    }

    /**
     * The provider of the service used in this usage.
     * @returns {import('./provider.js').Provider}
     */
    get provider() {
        return this.service.provider
    }

    /**
     * The assessment this usage belongs to.
     * @returns {import('./assessment.js').Assessment}
     */
    get assessment() {
        return this.provider.assessment
    }

    /**
     * Index of this usage within the service's usages array.
     * @returns {number}
     */
    get index() {
        return this.service.usages.indexOf(this)
    }

    /**
     * Removes this usage from the service.
     */
    remove() {
        this.service.usages.remove(this)
    }

    /**
     * Returns lint results for this usage.
     * @returns {import('./lint.js').Lint}
     */
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
