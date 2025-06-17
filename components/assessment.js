import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'
import { Tools } from './llm/tools.js'

export class Assessment {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)
    tools = new Tools()

    constructor(state) {
        if (isObj(state)) {
            this.state = state
        }

        this.tools.add(
            this.addNewProvider,
            'Add a new provider to the assessment',
        ).this(this)
            .param(
                'displayName',
                'string',
                'The display name of the new provider',
                true,
            ).param(
                'description',
                'string',
                'A description of the new provider',
            ).param(
                'type',
                'string',
                'The type of the new provider. It can only be one of these values: "System", "Component", "Group"',
            )

        this.tools.add(
            this.addNewConsumer,
            'Add a new consumer to the assessment',
        ).this(this)
            .param(
                'displayName',
                'string',
                'The display name of the new consumer',
                true,
            ).param(
                'description',
                'string',
                'A description of the new consumer',
            ).param(
                'type',
                'string',
                'The type of the new consumer. It can only be one of these values: "System", "Component", "Group"',
            )

        function getDateAndTime() {
            return String(new Date())
        }

        this.tools.add(getDateAndTime, 'Get the current date and time')
    }

    addNewProvider(state) {
        this.providers.pushNew(state)
    }

    addNewConsumer(state) {
        this.consumers.pushNew(state)
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

    get services() {
        return this.providers.flatMap((provider) => provider.services)
    }

    get consumptions() {
        return this.consumers.flatMap((consumer) => consumer.consumptions)
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
            `- ${icon('consumer')} indicates **Consumer**. Each Consumer has 1+ Consumption(s) to achieve a goal.`,
            `- ${icon('consumption')} indicates **Consumption**. Each Consumption belongs to exactly 1 Consumer.`,
            `- ${
                icon('dependency')
            } indicates **Dependency**. Each Dependency ties a Consumption to a Service. Each Dependency has 1+ Failure(s).`,
            `- ${
                icon('failure')
            } indicates **Failure**. Each Failure belongs to exactly one Dependency. Each Failure has a Symptom, a Consequence, and a Business Impact`,
            `- ${icon('symptom')} indicates **Symptom**`,
            `- ${icon('consequence')} indicates **Consequence**`,
            `- ${icon('impact')} indicates **Business Impact**`,
            `- ${icon('scope')} indicates a parent-child relationship like **Provider${
                icon('scope')
            }Service** or **Consumer${icon('scope')}Consumption**`,
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
        const lines = []

        function quoted(str) {
            return `"${str.replace(/"/g, '\\"')}"`
        }

        function fact(predicate, ...id) {
            lines.push(`${predicate}(${id.join(', ')}).`)
        }

        fact(
            '% consumer',
            'ConsumerID',
            'DisplayName',
            'Description',
            'Type',
        )
        this.consumers.forEach((consumer) => {
            fact(
                'consumer',
                consumer.id,
                quoted(consumer.displayName),
                quoted(consumer.description),
                consumer.type,
            )
        })

        fact(
            '% hasConsumption',
            'ConsumerID',
            'ConsumptionID',
        )
        this.consumptions.forEach((consumption) => {
            fact(
                'hasConsumption',
                consumption.consumer.id,
                consumption.id,
            )
        })

        fact(
            '% consumption',
            'ConsumptionID',
            'DisplayName',
            'Description',
        )
        this.consumptions.forEach((consumption) => {
            fact(
                'consumption',
                consumption.id,
                quoted(consumption.displayName),
                quoted(consumption.description),
            )
        })

        fact(
            '% provider',
            'ProviderID',
            'DisplayName',
            'Description',
            'Type',
        )
        this.providers.forEach((provider) => {
            fact(
                'provider',
                provider.id,
                quoted(provider.displayName),
                quoted(provider.description),
                provider.type,
            )
        })

        fact('% provides', 'ProviderID', 'ServiceID')
        this.services.forEach((service) => {
            lines.push(`provides(${service.provider.id}, ${service.id}).`)
        })

        fact(
            '% service',
            'ServiceID',
            'DisplayName',
            'Description',
        )
        this.services.forEach((service) => {
            fact(
                'service',
                service.id,
                quoted(service.displayName),
                quoted(service.description),
            )
        })

        fact(
            '% measures',
            'MetricID',
            'ServiceID',
        )

        this.metrics.forEach((metric) => {
            fact(
                'measures',
                metric.id,
                metric.service.id,
            )
        })

        fact(
            '% metric',
            'MetricID',
            'DisplayName',
            'Description',
            'IsBoolean',
            'NumericUnit',
        )
        this.metrics.forEach((metric) => {
            fact(
                'metric',
                metric.id,
                quoted(metric.displayName),
                quoted(metric.description),
                metric.isBoolean,
                quoted(metric.numericUnit),
            )
        })

        fact(
            '% indicates',
            'MetricID',
            'FailureID',
        )
        this.metrics.forEach((metric) => {
            for (const failure of metric.linkedFailures) {
                fact(
                    'indicates',
                    metric.id,
                    failure.id,
                )
            }
        })

        fact(
            '% failure',
            'FailureID',
            'Symptom',
            'Consequence',
            'BusinessImpact',
            'ImpactLevel',
        )
        this.failures.forEach((failure) => {
            fact(
                'failure',
                failure.id,
                quoted(failure.symptom),
                quoted(failure.consequence),
                quoted(failure.businessImpact),
                failure.impactLevel,
            )
        })

        return lines.join('\n')
    }
}
