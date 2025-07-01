import { Assessment } from '../../../components/assessment.js'
import { isInstance } from '../../../lib/validation.js'

/**
 * Taks the assessment and gives a recommendation based on what needs to be done
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
        const taskWithNoDependencies = assessment.tasks.find((task) => task.dependencies.length === 0)
        if (taskWithNoDependencies) {
            return `Task ${taskWithNoDependencies} has no dependencies. Help the user identify and add some dependencies to it.`
        }
    }

    // Services
    {
        const serviceWithNoDependencies = assessment.services.find((service) => service.dependencies.length === 0)
        if (serviceWithNoDependencies) {
            return `Service ${serviceWithNoDependencies} has no dependencies. Help the user identify and add some dependencies to it.`
        }
    }

    return 'All done!'
}
