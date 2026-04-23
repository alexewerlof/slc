import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../dependencies/jty.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Service } from './service.js'
import { Task } from './task.js'
import { unicodeSymbol } from '../lib/icons.js'
import { assessment2prolog } from '../app/assessment/cmp/prolog.js'
import { joinLines } from '../lib/markdown.js'
import { Entity } from '../lib/entity.js'
import { config } from '../config.js'
import { Lint } from './lint.js'

export class Assessment extends Entity {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)

    /**
     * Creates a new Assessment instance.
     * @param {Object} [state] Optional serialized state to restore.
     */
    constructor(state) {
        super('a', true)
        if (isObj(state)) {
            this.state = state
        }
    }

    /**
     * Returns the serialisable state of this Assessment.
     * @returns {Object}
     */
    get state() {
        const ret = super.state

        if (this.consumers.length) {
            ret.consumers = this.consumers.state
        }
        if (this.providers.length) {
            ret.providers = this.providers.state
        }
        return ret
    }

    /**
     * Restores the Assessment from a serialized state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { consumers, providers } = newState

        if (isDef(consumers)) {
            if (!isArr(consumers)) {
                throw new TypeError(`Invalid consumers array: ${consumers} (${typeof consumers})`)
            }
            this.consumers.state = consumers
        }
        if (isDef(providers)) {
            if (!isArr(providers)) {
                throw new TypeError(`Invalid providers array: ${providers} (${typeof providers})`)
            }
            this.providers.state = providers
        }
    }

    /**
     * Resets the Assessment to its default (empty) state.
     */
    remove() {
        this.displayName = config.displayName.default
        this.description = config.description.default
        this.providers.removeAll()
        this.consumers.removeAll()
    }

    /**
     * Returns the Usage that connects the given service and task, or undefined.
     * @param {Service} service
     * @param {Task} task
     * @returns {import('./usage.js').Usage|undefined}
     */
    findUsage(service, task) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        if (!isInstance(task, Task)) {
            throw new TypeError(`task must be an instance of Task. Got ${task}`)
        }
        return this.usages.find((usage) => {
            return usage.service === service && usage.task === task
        })
    }

    /**
     * All services across all providers.
     * @returns {import('./service.js').Service[]}
     */
    get services() {
        return this.providers.flatMap((provider) => provider.services)
    }

    /**
     * All tasks across all consumers.
     * @returns {import('./task.js').Task[]}
     */
    get tasks() {
        return this.consumers.flatMap((consumer) => consumer.tasks)
    }

    /**
     * All metrics across all services.
     * @returns {import('./metric.js').Metric[]}
     */
    get metrics() {
        return this.services.flatMap((service) => service.metrics)
    }

    /**
     * All usages across all services.
     * @returns {import('./usage.js').Usage[]}
     */
    get usages() {
        return this.services.flatMap((service) => service.usages)
    }

    /**
     * All failures sorted by descending impact level.
     * @returns {import('./failure.js').Failure[]}
     */
    get failures() {
        return this.usages.flatMap((usage) => usage.failures).sort((f1, f2) => f2.impactLevel - f1.impactLevel)
    }

    /**
     * Every entity in the assessment in traversal order.
     * @returns {import('../lib/entity.js').Entity[]}
     */
    get all() {
        const ret = []
        for (const consumer of this.consumers) {
            ret.push(consumer)
            for (const task of consumer.tasks) {
                ret.push(task)
            }
        }
        for (const provider of this.providers) {
            ret.push(provider)
            for (const service of provider.services) {
                ret.push(service)
                for (const usage of service.usages) {
                    ret.push(usage)
                    for (const failure of usage.failures) {
                        ret.push(failure)
                    }
                }
                for (const metric of service.metrics) {
                    ret.push(metric)
                }
            }
        }

        return ret
    }

    /**
     * Finds an entity by its unique id.
     * @param {string} id
     * @returns {import('../lib/entity.js').Entity|undefined}
     */
    getEntityById(id) {
        return this.all.find((entity) => entity.id === id)
    }

    /**
     * Returns entities filtered by class name, or all entities when className is undefined.
     * @param {string} [className]
     * @returns {import('../lib/entity.js').Entity[]}
     */
    getEntitiesByClassName(className) {
        switch (className) {
            case 'Provider':
                return this.providers
            case 'Service':
                return this.services
            case 'Consumer':
                return this.consumers
            case 'Task':
                return this.tasks
            case 'Usage':
                return this.usages
            case 'Failure':
                return this.failures
            case 'Metric':
                return this.metrics
            case undefined:
                return this.all
            default:
                throw new TypeError(`Unknown class name: ${className}`)
        }
    }

    /**
     * Returns all failures belonging to the given service.
     * @param {Service} service
     * @returns {import('./failure.js').Failure[]}
     */
    findFailures(service) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        return this.failures.filter((failure) => failure.usage.service === service)
    }

    /**
     * Returns a markdown-formatted summary of the assessment.
     * @returns {string}
     */
    toString() {
        const lines = []
        const emptyLine = '\n'
        const newParagraph = '\n\n'

        lines.push(
            `# Assessment ${this.displayName}`,
            emptyLine,
            this.description,
            emptyLine,
            `This is the current state of the assessment.`,
            emptyLine,
        )

        lines.push(
            `## Icons`,
            emptyLine,
            `- ${unicodeSymbol('provider')} indicates **Provider**. Each Provider offers 1+ Service(s).`,
            `- ${unicodeSymbol('service')} indicates **Service**. Each Service is offered by exactly 1 Provider.`,
            `- ${unicodeSymbol('consumer')} indicates **Consumer**. Each Consumer has 1+ Task(s) to achieve a goal.`,
            `- ${unicodeSymbol('task')} indicates **Task**. Each Task belongs to exactly 1 Consumer.`,
            `- ${unicodeSymbol(
                'usage',
            )} indicates **Usage**. Each Usage ties a Task to a Service. Each Usage has 1+ Failure(s).`,
            `- ${unicodeSymbol(
                'failure',
            )} indicates **Failure**. Each Failure belongs to exactly one Usage. Each Failure has a Symptom, a Consequence, and a Business Impact`,
            `- ${unicodeSymbol('symptom')} indicates **Symptom**`,
            `- ${unicodeSymbol('consequence')} indicates **Consequence**`,
            `- ${unicodeSymbol('impact')} indicates **Business Impact**`,
            `- ${unicodeSymbol('scope')} indicates a parent-child relationship like **Provider${unicodeSymbol(
                'scope',
            )}Service** or **Consumer${unicodeSymbol('scope')}Task**`,
        )

        lines.push(newParagraph)

        lines.push(`## Providers`, emptyLine)

        for (const provider of this.providers) {
            lines.push(`- ${unicodeSymbol('provider')} **${provider.displayName}**: ${provider.description}`)
            for (const service of provider.services) {
                lines.push(`  - ${unicodeSymbol('service')} **${service.displayName}**: ${service.description}`)
                for (const usage of this.usages) {
                    if (usage.service === service) {
                        lines.push(
                            `    - ${unicodeSymbol(
                                'usage',
                            )} **${usage.task.consumer.displayName}**: ${usage.description}`,
                        )
                    }
                }
            }
        }

        lines.push(`## Consumers`, emptyLine)

        for (const consumer of this.consumers) {
            lines.push(`- ${unicodeSymbol('consumer')} **${consumer.displayName}**: ${consumer.description}`)
            for (const task of consumer.tasks) {
                lines.push(`  - ${unicodeSymbol('task')} **${task.displayName}**: ${task.description}`)
                for (const usage of this.usages) {
                    if (usage.task === task) {
                        lines.push(
                            `    - ${unicodeSymbol('usage')} **${usage.service.displayName}**: ${usage.description}`,
                        )
                    }
                }
            }
        }

        lines.push(`## Usages`, emptyLine)

        for (const usage of this.usages) {
            lines.push(`- ${usage}`)
        }

        lines.push(`## Failures`, emptyLine)

        for (const failure of this.failures) {
            lines.push(`- ${failure}`)
        }

        lines.push(`## Metrics`, emptyLine)

        for (const metric of this.metrics) {
            lines.push(`- ${metric}`)

            for (const linkedFailure of metric.linkedFailures) {
                lines.push(`  - ${linkedFailure}`)
            }
        }

        return joinLines(1, ...lines)
    }

    /**
     * Converts the assessment to a Prolog representation.
     * @returns {string}
     */
    toProlog() {
        return assessment2prolog(this)
    }

    /**
     * Returns lint results for the assessment.
     * @returns {Lint}
     */
    get lint() {
        const lint = new Lint()

        if (this.providers.length === 0) {
            lint.warn('There are no service **providers** or services. Please add some service providers.')
        }

        if (this.consumers.length === 0) {
            lint.warn('There are no **consumers** or tasks. Please add some service consumers.')
        }

        return lint
    }

    /**
     * Returns an array of markdown strings containing lint messages for the assessment and all entities.
     * @returns {string[]}
     */
    markdownLint() {
        const ret = []

        if (this.lint.count) {
            ret.push('## Assessment Lint')
            ret.push(this.lint.toMarkdown())
        }

        for (const entity of this.all) {
            if (entity.lint.count) {
                ret.push(`## ${entity.className} ${entity.id}`)
                ret.push(entity.lint.toMarkdown())
            }
        }

        return ret.join('\n\n')
    }
}
