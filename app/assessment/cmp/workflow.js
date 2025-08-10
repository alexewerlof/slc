import { Assessment } from '../../../components/assessment.js'
import { isInstance } from '../../../lib/validation.js'

/**
 * Goes through the assessment and gives a recommendation based on what needs to be done.
 * This is essentially the core of the assessment workflow.
 * @param {Assessment} assessment
 */
export function nextStep(assessment) {
    if (!isInstance(assessment, Assessment)) {
        throw new TypeError(`Expected an instance of Assessment. Got ${assessment}`)
    }

    // Assessment root node
    {
        if (assessment.providers.length === 0) {
            if (assessment.consumers.length) {
                return 'There are some service consumers but no Service Providers. Help the user identify and add one.'
            } else {
                return "Let's start by having an overview about your architecture. There are currently no Service Providers. Help the user identify and add one."
            }
        }

        if (assessment.consumers.length === 0) {
            return 'There are currently no Consumers. Help the user identify and add one.'
        }
    }

    // Providers
    {
        const providerWithNoServices = assessment.providers.find((provider) => provider.services.length === 0)
        if (providerWithNoServices) {
            return `Provider ${providerWithNoServices} has no services. Help the user identify and add some services to it.`
        }
    }

    // Consumers
    {
        const consumerWithNoTasks = assessment.consumers.find((consumer) => consumer.tasks.length === 0)
        if (consumerWithNoTasks) {
            return `Consumer ${consumerWithNoTasks} has no tasks. Help the user identify and add some tasks to it.`
        }
    }

    // Tasks
    {
        const taskWithNoUsages = assessment.tasks.find((task) => task.usages.length === 0)
        if (taskWithNoUsages) {
            return `Task ${taskWithNoUsages} has no usages. Help the user identify and add some usages to it.`
        }
    }

    // Services
    {
        const serviceWithNoUsages = assessment.services.find((service) => service.usages.length === 0)
        if (serviceWithNoUsages) {
            return `Service ${serviceWithNoUsages} has no usages. Help the user identify and add some usages to it.`
        }
    }

    return 'All done!'
}
