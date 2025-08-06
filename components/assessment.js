import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Service } from './service.js'
import { Task } from './task.js'
import { unicodeSymbol } from '../lib/icons.js'
import { assessment2prolog } from '../app/assessment/cmp/prolog.js'
import { joinLines } from '../lib/markdown.js'
import { Entity } from '../lib/entity.js'
import { config } from '../config.js'

export class Assessment extends Entity {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)

    constructor(state) {
        super('a', true)
        if (isObj(state)) {
            this.state = state
        }
    }

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

    set state(newState) {
        super.state = newState

        const {
            consumers,
            providers,
        } = newState

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

    remove() {
        this.displayName = config.displayName.default
        this.description = config.description.default
        this.providers.removeAll()
        this.consumers.removeAll()
    }

    findUsage(service, task) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        if (!isInstance(task, Task)) {
            throw new TypeError(`task must be an instance of Task. Got ${task}`)
        }
        return this.usages.find((usage) => {
            return (
                usage.service === service &&
                usage.task === task
            )
        })
    }

    get services() {
        return this.providers.flatMap((provider) => provider.services)
    }

    get tasks() {
        return this.consumers.flatMap((consumer) => consumer.tasks)
    }

    get metrics() {
        return this.services.flatMap((service) => service.metrics)
    }

    get usages() {
        return this.services.flatMap((service) => service.usages)
    }

    get failures() {
        return this.usages
            .flatMap((usage) => usage.failures)
            .sort((f1, f2) => f2.impactLevel - f1.impactLevel)
    }

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

    getEntityById(id) {
        return this.all.find((entity) => entity.id === id)
    }

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

    findFailures(service) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        return this.failures.filter((failure) => failure.usage.service === service)
    }

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
            `- ${
                unicodeSymbol('usage')
            } indicates **Usage**. Each Usage ties a Task to a Service. Each Usage has 1+ Failure(s).`,
            `- ${
                unicodeSymbol('failure')
            } indicates **Failure**. Each Failure belongs to exactly one Usage. Each Failure has a Symptom, a Consequence, and a Business Impact`,
            `- ${unicodeSymbol('symptom')} indicates **Symptom**`,
            `- ${unicodeSymbol('consequence')} indicates **Consequence**`,
            `- ${unicodeSymbol('impact')} indicates **Business Impact**`,
            `- ${unicodeSymbol('scope')} indicates a parent-child relationship like **Provider${
                unicodeSymbol('scope')
            }Service** or **Consumer${unicodeSymbol('scope')}Task**`,
        )

        lines.push(newParagraph)

        lines.push(
            `## Providers`,
            emptyLine,
        )

        for (const provider of this.providers) {
            lines.push(
                `- ${unicodeSymbol('provider')} **${provider.displayName}**: ${provider.description}`,
            )
            for (const service of provider.services) {
                lines.push(
                    `  - ${unicodeSymbol('service')} **${service.displayName}**: ${service.description}`,
                )
                for (const usage of this.usages) {
                    if (usage.service === service) {
                        lines.push(
                            `    - ${
                                unicodeSymbol('usage')
                            } **${usage.task.consumer.displayName}**: ${usage.description}`,
                        )
                    }
                }
            }
        }

        lines.push(
            `## Consumers`,
            emptyLine,
        )

        for (const consumer of this.consumers) {
            lines.push(
                `- ${unicodeSymbol('consumer')} **${consumer.displayName}**: ${consumer.description}`,
            )
            for (const task of consumer.tasks) {
                lines.push(
                    `  - ${unicodeSymbol('task')} **${task.displayName}**: ${task.description}`,
                )
                for (const usage of this.usages) {
                    if (usage.task === task) {
                        lines.push(
                            `    - ${unicodeSymbol('usage')} **${usage.service.displayName}**: ${usage.description}`,
                        )
                    }
                }
            }
        }

        lines.push(
            `## Usages`,
            emptyLine,
        )

        for (const usage of this.usages) {
            lines.push(
                `- ${usage}`,
            )
        }

        lines.push(
            `## Failures`,
            emptyLine,
        )

        for (const failure of this.failures) {
            lines.push(
                `- ${failure}`,
            )
        }

        lines.push(
            `## Metrics`,
            emptyLine,
        )

        for (const metric of this.metrics) {
            lines.push(
                `- ${metric}`,
            )

            for (const linkedFailure of metric.linkedFailures) {
                lines.push(
                    `  - ${linkedFailure}`,
                )
            }
        }

        return joinLines(1, ...lines)
    }

    toProlog() {
        return assessment2prolog(this)
    }

    updateLint(lint) {
        if (this.providers.length === 0) {
            lint.warn('There are no service **providers** or services. Please add some service providers.')
        }

        if (this.consumers.length === 0) {
            lint.warn('There are no **consumers** or tasks. Please add some service consumers.')
        }
    }

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
