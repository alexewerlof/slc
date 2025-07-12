import { Assessment } from '../../../components/assessment.js'
import { Formula } from '../../../components/ui/formula.js'
import { isInstance, isStr } from '../../../lib/validation.js'

function quoted(str) {
    return `"${str.replace(/"/g, '\\"')}"`
}

export function assessment2prolog(assessment) {
    if (!isInstance(assessment, Assessment)) {
        throw new TypeError(`Expected an instance of assessment. Got ${assessment} (${typeof assessment})}`)
    }

    const formula = new Formula()

    function fact(predicate, ...ids) {
        if (predicate.startsWith('% ')) {
            formula.addCmnt(`${predicate}(${ids.join(', ')}).`)
        } else {
            formula.addFunct(predicate)
            formula.addPunct('(')
            for (const id of ids) {
                if (!isStr(id)) {
                    formula.addConst(id)
                } else if (id.startsWith('"')) {
                    formula.addStr(id)
                } else {
                    formula.addExpr(id)
                }
                formula.addPunct(', ')
            }
            formula.pop() // remove last comma
            formula.addPunct(').')
        }
        formula.addBreak()
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
        '% providesService',
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
        '% uses',
        'TaskID',
        'ServiceID',
    )
    assessment.usages.forEach((usage) => {
        fact(
            'uses',
            usage.task.id,
            usage.service.id,
        )
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

    return formula
}
