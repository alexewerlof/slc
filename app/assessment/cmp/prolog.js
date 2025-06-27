import { Assessment } from '../../../components/assessment.js'
import { isInstance } from '../../../lib/validation.js'

function quoted(str) {
    return `"${str.replace(/"/g, '\\"')}"`
}

export function assessment2prolog(assessment) {
    if (!isInstance(assessment, Assessment)) {
        throw new TypeError(`Expected an instance of assessment. Got ${assessment} (${typeof assessment})}`)
    }

    const lines = []

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
    assessment.consumers.forEach((consumer) => {
        fact(
            'consumer',
            consumer.id,
            quoted(consumer.displayName),
            quoted(consumer.description),
            consumer.type,
        )
    })

    fact(
        '% hasTask',
        'ConsumerID',
        'TaskID',
    )
    assessment.tasks.forEach((task) => {
        fact(
            'hasTask',
            task.consumer.id,
            task.id,
        )
    })

    fact(
        '% task',
        'TaskID',
        'DisplayName',
        'Description',
    )
    assessment.tasks.forEach((task) => {
        fact(
            'task',
            task.id,
            quoted(task.displayName),
            quoted(task.description),
        )
    })

    fact(
        '% dependency',
        'TaskID',
        'ServiceID',
    )

    assessment.dependencies.forEach((dependency) => {
        fact(
            'dependency',
            dependency.task.id,
            dependency.service.id,
        )
    })

    fact(
        '% provider',
        'ProviderID',
        'DisplayName',
        'Description',
        'Type',
    )
    assessment.providers.forEach((provider) => {
        fact(
            'provider',
            provider.id,
            quoted(provider.displayName),
            quoted(provider.description),
            provider.type,
        )
    })

    fact(
        '% provides',
        'ProviderID',
        'ServiceID',
    )
    assessment.services.forEach((service) => {
        fact(
            `provides`,
            service.provider.id,
            service.id,
        )
    })

    fact(
        '% service',
        'ServiceID',
        'DisplayName',
        'Description',
    )
    assessment.services.forEach((service) => {
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

    assessment.metrics.forEach((metric) => {
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
    assessment.metrics.forEach((metric) => {
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
    assessment.metrics.forEach((metric) => {
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
    assessment.failures.forEach((failure) => {
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
