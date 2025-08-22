import { Usage } from '../../../components/usage.js'
import { isInstance } from '../../../lib/validation.js'
import { Toolbox } from '../../../components/llm/toolbox.js'
import { joinLines } from '../../../lib/markdown.js'

export function createToolbox(assessmentEditorComponent) {
    const toolbox = new Toolbox()
    toolbox.add('listEntities', 'Returns the id of entities with the specified class name.')
        .prm(
            'className:string',
            'When specified, it filters the results to a subset of entities. It can only be one of these values: "Provider", "Consumer", "Service", "Task", "Usage", "Failure", "Metric". If abandoned, all types of entities will be returned.',
        ).fn(({ className }) => {
            return assessmentEditorComponent.assessment.getEntitiesByClassName(className).map(({ id }) => id)
        })

    toolbox.add(
        'removeEntity',
        'Removes an entity given its id. Throws if it cannot find the entity or the user authorizes deletion.',
    )
        .prm('id:string*', 'The id of the entity to delete')
        .fn(({ id }) => {
            const entity = assessmentEditorComponent.assessment.getEntityById(id)
            if (!entity) {
                throw new RangeError(`Could not find an entity with id ${id}`)
            }
            const deleted = assessmentEditorComponent.removeEditingInstance(entity)
            return [
                'Entity with id',
                id,
                'is',
                deleted ? 'removed' : 'not removed',
            ].join(' ')
        })

    toolbox.add(
        'clearAssessment',
        'Clear the assessment of all Providers, Consumers, Services, Tasks, Usages, Failures, and Metrics.',
    ).this(assessmentEditorComponent).fn(() => {
        assessmentEditorComponent.removeEditingInstance(assessmentEditorComponent.assessment)
    })

    toolbox.add(
        'getEntityState',
        'Returns information about a particular Provider, Consumer, Service, Task, Usage, Failure, Metric in JSON format.',
    )
        .prm('id:string*', 'The id of the entity to get the state of')
        .fn(({ id }) => {
            const entity = assessmentEditorComponent.assessment.getEntityById(id)
            if (!entity) {
                throw new Error(`Entity with id ${id} not found`)
            }
            return entity.state
        })

    toolbox.add(
        'updateEntity',
        'Updates the attributes of a particular Assessment, Provider, Consumer, Service, Task, Usage, Failure, or Metric.',
    )
        .prm('id:string*', 'The id of the entity to update')
        .prm(
            'state:object',
            joinLines(
                0,
                'The new state of the entity. The value depends on object.',
                'Call getEntityState() first to understand the shape and values before trying to set them.',
                'Only the properties that you specify in the state will be updated and the rest will remain as is.',
            ),
        )
        .fn(({ id, state }) => {
            const entity = assessmentEditorComponent.assessment.getEntityById(id)
            if (!entity) {
                throw new Error(`Entity with id ${id} not found`)
            }
            return entity.state = state
        })

    toolbox.add(
        'addNewConsumer',
        'Add a new consumer to the assessment and return its id.',
    )
        .prm('displayName:string*', 'The display name of the new consumer')
        .prm('description:string', 'A description of the new consumer')
        .prm(
            'type:string',
            'The type of the new consumer. It can only be one of these values: "System", "Component", "Group"',
        )
        .fn((state) => {
            const newConsumer = assessmentEditorComponent.assessment.consumers.pushNew(state)
            assessmentEditorComponent.editingInstance = newConsumer
            return newConsumer.id
        })

    toolbox.add(
        'addNewProvider',
        'Add a new provider to the assessment and return its id.',
    )
        .prm('displayName:string*', 'The display name of the new provider')
        .prm('description:string', 'A description of the new provider')
        .prm(
            'type:string',
            'The type of the new provider. It can only be one of these values: "System", "Component", "Group"',
        )
        .fn((state) => {
            const newProvider = assessmentEditorComponent.assessment.providers.pushNew(state)
            assessmentEditorComponent.editingInstance = newProvider
            return newProvider.id
        })

    toolbox.add(
        'addNewService',
        'Add a new service to the designated provider and return its id.',
    )
        .prm('providerId:string*', 'The id of the provider to add the service to')
        .prm('displayName:string*', 'The display name of the new service')
        .prm('description:string', 'A description of the new service')
        .prm(
            'type:string',
            'The type of the new service. It can only be one of these values: "Automated", "Manual", "Hybrid"',
        )
        .fn((options) => {
            const { providerId, ...state } = options
            const provider = assessmentEditorComponent.assessment.providers.find(({ id }) => id === providerId)
            if (!provider) {
                throw new Error(`Provider with id ${providerId} not found`)
            }
            const newService = provider.services.pushNew(state)
            assessmentEditorComponent.editingInstance = newService
            return newService.id
        })

    toolbox.add(
        'addNewTask',
        'Add a new task to the designated consumer and return its id.',
    )
        .prm('consumerId:string*', 'The id of the consumer to add the task to')
        .prm('displayName:string*', 'The display name of the new task')
        .prm('description:string', 'A description of the new task')
        .fn((options) => {
            const { consumerId, ...state } = options
            const consumer = assessmentEditorComponent.assessment.consumers.find(({ id }) => id === consumerId)
            if (!consumer) {
                throw new Error(`Consumer with id ${consumerId} not found`)
            }
            const newTask = consumer.tasks.pushNew(state)
            assessmentEditorComponent.editingInstance = newTask
            return newTask.id
        })

    toolbox.add(
        'addNewUsage',
        'Create a new usage between an existing task and service, then return the id of the usage.',
    )
        .prm('serviceId:string*', 'The id of the service to add the usage to')
        .prm('taskId:string*', 'The id of the task to add the usage to')
        .fn((options) => {
            const { serviceId, taskId } = options
            const service = assessmentEditorComponent.assessment.services.find(({ id }) => id === serviceId)
            if (!service) {
                throw new Error(`Service with id ${serviceId} not found`)
            }
            const newUsage = service.usages.pushNew({ taskId })
            assessmentEditorComponent.editingInstance = newUsage
            return newUsage.id
        })

    toolbox.add(
        'addNewFailure',
        'Add a new failure to an existing usage, and then return the id of the newly created failure.',
    )
        .prm('usageId: string*', 'The id of the usage to add the failure to')
        .prm(
            'symptom: string*',
            'The consumer-facing symptom. This is how the failure negatively impacts the Task.',
        )
        .prm('consequence: string', 'The consequence of the failure on the consumer')
        .prm(
            'businessImpact: string',
            'The impact of the failure on the ability of the business to make or save money',
        )
        .fn((options) => {
            const { usageId, ...state } = options
            const usage = assessmentEditorComponent.assessment.usages.find(({ id }) => id === usageId)
            if (!isInstance(usage, Usage)) {
                throw new Error(`Could not find a usage with id "${usageId}"`)
            }
            const newFailure = usage.failures.pushNew(state)
            assessmentEditorComponent.editingInstance = usage
            usage.failures.selected = newFailure
            return newFailure.id
        })

    toolbox.add(
        'addNewMetric',
        'Add a new Metric to an existing service, and then return the id of the newly created metric.',
    )
        .prm('serviceId:string*', 'The id of the service to add the metric to')
        .prm('displayName:string*', 'The name of the metric')
        .prm('description:string', 'Some description about why this metric exists and where it is measured')
        // .prm('isBoolean:string', '')
        // .prm('numericUnit:string', '')
        .prm('failureIds:string[]', 'A list of failure ids that this metric helps measure')
        .fn((options) => {
            const { serviceId, ...state } = options
            const service = assessmentEditorComponent.assessment.services.find(({ id }) => id === serviceId)
            if (!service) {
                throw new Error(`Service with id ${serviceId} not found`)
            }
            const newMetric = service.metrics.pushNew(state)
            assessmentEditorComponent.editingInstance = newMetric
            return newMetric.id
        })

    toolbox.add('getDateAndTime', 'Get the current date and time').fn(() => String(new Date()))

    return toolbox
}
