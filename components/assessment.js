import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Dependency } from './dependency.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'

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

    findDependency(service, consumption) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        if (!isInstance(consumption, Consumption)) {
            throw new TypeError(`consumption must be an instance of Consumption. Got ${consumption}`)
        }
        return this.dependencies.find((dependency) => {
            return (
                dependency.service === service &&
                dependency.consumption === consumption
            )
        })
    }

    isLinked(service, consumption) {
        return this.findDependency(service, consumption) !== undefined
    }

    setLinked(service, consumption, value) {
        if (value) {
            if (!this.isLinked(service, consumption)) {
                this.dependencies.push(
                    new Dependency(this, {
                        providerIndex: service.provider.index,
                        serviceIndex: service.index,
                        consumerIndex: consumption.consumer.index,
                        consumptionIndex: consumption.index,
                    }),
                )
            }
        } else {
            const dependency = this.findDependency(service, consumption)
            if (dependency) {
                this.dependencies.remove(dependency)
            }
        }
    }

    get services() {
        return this.providers.flatMap((provider) => provider.services)
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
            `- ${icon('provider')} indicates **Provider**`,
            `- ${icon('service')} indicates **Service**`,
            `- ${icon('consumer')} indicates **Consumer**`,
            `- ${icon('consumption')} indicates **Consumption**`,
            `- ${icon('dependency')} indicates **Dependency**`,
            `- ${icon('failure')} indicates **Failure**`,
            `- ${icon('symptom')} indicates **Symptom**`,
            `- ${icon('consequence')} indicates **Consequence**`,
            `- ${icon('impact')} indicates **Business Impact**`,
            `- ${icon('scope')} indicates a parent-child relationship like **Provider${
                icon('scope')
            }Service** or **Consumer${icon('scope')}Consumption**`,
        )

        lines.push(
            `## Relationships`,
            emptyLine,
            `- Each Provider offers 1+ Service(s).`,
            `- Each Consumer has 1+ Consumption(s) to achieve a goal.`,
            `- Each Dependency ties a Consumption to a Service.`,
            `- Each Dependency has 1+ Failure(s).`,
            `- Each Failure has a Symptom, a Consequence, and a Business Impact`,
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
                            } **${dependency.consumption.consumer.displayName}**: ${dependency.description}`,
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
            for (const consumption of consumer.consumptions) {
                lines.push(
                    `  - ${icon('consumption')} **${consumption.displayName}**: ${consumption.description}`,
                )
                for (const dependency of this.dependencies) {
                    if (dependency.consumption === consumption) {
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

        return lines.join('\n')
    }
}
