import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Service } from './service.js'
import { Task } from './task.js'
import { icon } from '../lib/icons.js'
import { Lint } from './lint.js'
import { assessment2prolog } from '../app/assessment/cmp/prolog.js'

export class Assessment {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)

    constructor(state) {
        if (isObj(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            consumers: this.consumers.state,
            providers: this.providers.state,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`Invalid options: ${newState} (${typeof newState})`)
        }

        const {
            consumers,
            providers,
        } = newState

        if (isDef(consumers)) {
            this.consumers.state = consumers
        }
        if (isDef(providers)) {
            if (!isArr(providers)) {
                throw new TypeError(`Invalid providers: ${providers} (${typeof providers})`)
            }
            this.providers.state = providers
        }
    }

    clear() {
        this.providers.removeAll()
        this.consumers.removeAll()
    }

    findDependency(service, task) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        if (!isInstance(task, Task)) {
            throw new TypeError(`task must be an instance of Task. Got ${task}`)
        }
        return this.dependencies.find((dependency) => {
            return (
                dependency.service === service &&
                dependency.task === task
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

    get dependencies() {
        return this.services.flatMap((service) => service.dependencies)
    }

    get failures() {
        return this.dependencies
            .flatMap((dependency) => dependency.failures)
            .sort((f1, f2) => f2.impactLevel - f1.impactLevel)
    }

    findFailures(service) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        return this.failures.filter((failure) => failure.dependency.service === service)
    }

    toString() {
        const lines = []
        const emptyLine = '\n'
        const newParagraph = '\n\n'

        lines.push(
            '# Assessment',
            emptyLine,
            `This is the current state of the assessment.`,
            emptyLine,
        )

        lines.push(
            `## Icons`,
            emptyLine,
            `- ${icon('provider')} indicates **Provider**. Each Provider offers 1+ Service(s).`,
            `- ${icon('service')} indicates **Service**. Each Service is offered by exactly 1 Provider.`,
            `- ${icon('consumer')} indicates **Consumer**. Each Consumer has 1+ Task(s) to achieve a goal.`,
            `- ${icon('task')} indicates **Task**. Each Task belongs to exactly 1 Consumer.`,
            `- ${
                icon('dependency')
            } indicates **Dependency**. Each Dependency ties a Task to a Service. Each Dependency has 1+ Failure(s).`,
            `- ${
                icon('failure')
            } indicates **Failure**. Each Failure belongs to exactly one Dependency. Each Failure has a Symptom, a Consequence, and a Business Impact`,
            `- ${icon('symptom')} indicates **Symptom**`,
            `- ${icon('consequence')} indicates **Consequence**`,
            `- ${icon('impact')} indicates **Business Impact**`,
            `- ${icon('scope')} indicates a parent-child relationship like **Provider${
                icon('scope')
            }Service** or **Consumer${icon('scope')}Task**`,
        )

        lines.push(newParagraph)

        lines.push(
            `## Providers`,
            emptyLine,
        )

        for (const provider of this.providers) {
            lines.push(
                `- ${icon('provider')} **${provider.displayName}**: ${provider.description}`,
            )
            for (const service of provider.services) {
                lines.push(
                    `  - ${icon('service')} **${service.displayName}**: ${service.description}`,
                )
                for (const dependency of this.dependencies) {
                    if (dependency.service === service) {
                        lines.push(
                            `    - ${
                                icon('dependency')
                            } **${dependency.task.consumer.displayName}**: ${dependency.description}`,
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
                `- ${icon('consumer')} **${consumer.displayName}**: ${consumer.description}`,
            )
            for (const task of consumer.tasks) {
                lines.push(
                    `  - ${icon('task')} **${task.displayName}**: ${task.description}`,
                )
                for (const dependency of this.dependencies) {
                    if (dependency.task === task) {
                        lines.push(
                            `    - ${
                                icon('dependency')
                            } **${dependency.service.displayName}**: ${dependency.description}`,
                        )
                    }
                }
            }
        }

        lines.push(
            `## Dependencies`,
            emptyLine,
        )

        for (const dependency of this.dependencies) {
            lines.push(
                `- ${dependency}`,
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

        return lines.join('\n')
    }

    toProlog() {
        return assessment2prolog(this)
    }

    get lint() {
        const lint = new Lint()
        if (this.providers.length === 0) {
            lint.warn('There are no serivce **providers**. Please add some service providers.')
        }

        if (this.consumers.length === 0) {
            lint.warn('There are no **consumers**. Please add some service consumers.')
        }

        return lint
    }

    markdownLint() {
        const ret = []

        ret.push(this.lint.toMarkdown('Assessment Lint'))

        for (const provider of this.providers) {
            ret.push(provider.lint.toMarkdown(`Provider ${provider.id}`))
        }

        for (const consumer of this.consumers) {
            ret.push(consumer.lint.toMarkdown(`Consumer ${consumer.id}`))
        }

        for (const service of this.services) {
            ret.push(service.lint.toMarkdown(`Service ${service.id}`))
        }

        for (const task of this.tasks) {
            ret.push(task.lint.toMarkdown(`Task ${task.id}`))
        }

        for (const dependency of this.dependencies) {
            ret.push(dependency.lint.toMarkdown(`Dependency ${dependency.id}`))
        }

        for (const metric of this.metrics) {
            ret.push(metric.lint.toMarkdown(`Metric ${metric.id}`))
        }

        for (const failure of this.failures) {
            ret.push(failure.lint.toMarkdown(`Failure ${failure.id}`))
        }

        return ret.filter((s) => s.length).join('\n\n')
    }
}
