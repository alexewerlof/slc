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
            formula.addCmnt(`${predicate}/${ids.length} (${ids.join(', ')}).`)
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

    fact('% assessment', 'AssessmentID', 'DisplayName')

    fact('assessment', assessment.id, quoted(assessment.displayName))

    fact('% consumer', 'ConsumerID', 'DisplayName', 'Type')
    assessment.consumers.forEach((consumer) => {
        fact('consumer', consumer.id, quoted(consumer.displayName), consumer.type)
    })

    fact('% provider', 'ProviderID', 'DisplayName', 'Type')
    assessment.providers.forEach((provider) => {
        fact('provider', provider.id, quoted(provider.displayName), provider.type)
    })

    fact('% hasTask', 'ConsumerID', 'TaskID')
    assessment.tasks.forEach((task) => {
        fact('hasTask', task.consumer.id, task.id)
    })

    fact('% task', 'TaskID', 'DisplayName')
    assessment.tasks.forEach((task) => {
        fact('task', task.id, quoted(task.displayName))
    })

    fact('% providesService', 'ProviderID', 'ServiceID')
    assessment.services.forEach((service) => {
        fact(`providesService`, service.provider.id, service.id)
    })

    fact('% service', 'ServiceID', 'DisplayName', 'Type')
    assessment.services.forEach((service) => {
        fact('service', service.id, quoted(service.displayName), service.type)
    })

    fact('% hasMetric', 'ServiceID', 'MetricID')
    assessment.metrics.forEach((metric) => {
        fact('hasMetric', metric.service.id, metric.id)
    })

    fact('% uses', 'TaskID', 'ServiceID', 'UsageID')
    assessment.usages.forEach((usage) => {
        fact('uses', usage.task.id, usage.service.id, usage.id)
    })

    fact('% canFail', 'UsageID', 'FailureID')

    assessment.usages.forEach((usage) => {
        usage.failures.forEach((failure) => {
            fact('canFail', usage.id, failure.id)
        })
    })

    fact('% failure', 'FailureID', 'Symptom', 'ImpactLevel')
    assessment.failures.forEach((failure) => {
        fact('failure', failure.id, quoted(failure.symptom), failure.impactLevel)
    })

    fact('% metric', 'MetricID', 'DisplayName')
    assessment.metrics.forEach((metric) => {
        fact('metric', metric.id, quoted(metric.displayName))
    })

    fact('% indicates', 'MetricID', 'FailureID')
    assessment.metrics.forEach((metric) => {
        for (const failure of metric.linkedFailures) {
            fact('indicates', metric.id, failure.id)
        }
    })

    return formula
}
