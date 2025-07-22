import { Assessment } from '../../../components/assessment.js'
import { Consumer } from '../../../components/consumer.js'
import { Task } from '../../../components/task.js'
import { Usage } from '../../../components/usage.js'
import { Metric } from '../../../components/metric.js'
import { Provider } from '../../../components/provider.js'
import { Service } from '../../../components/service.js'
import { ContentBead, FileBead, Thread } from '../../../components/llm/thread.js'
import { isInstance } from '../../../lib/validation.js'
import { Toolbox } from '../../../components/llm/toolbox.js'
import { nextStep } from './workflow.js'
import { joinLines } from '../../../lib/markdown.js'

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        const thread = new Thread(
            new FileBead('assessment-prompt.md' /*'../../prompts/glossary.md'*/),
            new ContentBead(
                { role: 'system' },
                'This is the current and latest state of the assessment that is kept updated as you add, remove, or modify entities.',
                '```json',
                () => JSON.stringify(this.assessment.state),
                '```',
                'To help you guide the user through the assessment, a deterministic algorithm is used to analyze the current state of the assessment and here is what you need to do:',
                () => nextStep(this.assessment),
                'To help you understand the assessment, we have some heuristics that analyze the assessment and all its entities. If there is a a warning or error, please prioritize fixing them.',
                () => this.assessment.markdownLint(),
                'These heuristics are a great tip for you to ask the right questions and help the user add any missing entities or fix any issues in the assessment.',
                'You can also use the provided tools to add new entities or get information about existing ones.',
                'Focus on fixing the most important problem first. Errors have higher priority than warnings.And issues with Providers are more important than services. Similarly, issues with Consumers are more important than Tasks. Usages are less important than both Services and Tasks. And Failures are less important than Usages. Issues with the Metrics are the least important and should be addressed last.',
            ),
            new ContentBead(
                {
                    role: 'assistant',
                    isGhost: true,
                    isDebug: false,
                    isPersistent: true,
                },
                'I can help you identify different aspects of your service topology in order to identify the best metrics.',
                'Tell me about your system.',
            ),
        )

        const toolbox = new Toolbox()
        toolbox.add('listEntities', 'Returns the id of entities with the specified class name.')
            .prm(
                'className:string',
                'When specified, it filters the results to a subset of entities. It can only be one of these values: "Provider", "Consumer", "Service", "Task", "Usage", "Failure", "Metric". If abandoned, all types of entities will be returned.',
            ).fn(({ className }) => {
                return this.assessment.getEntitiesByClassName(className).map(({ id }) => id)
            })

        toolbox.add(
            'removeEntity',
            'Removes an entity given its id. Throws if it cannot find the entity or the user authorizes deleteion.',
        )
            .prm('id:string*', 'The id of the entity to delete')
            .fn(({ id }) => {
                const entity = this.assessment.getEntityById(id)
                if (!entity) {
                    throw new RangeError(`Could not find an entity with id ${id}`)
                }
                if (!confirm(`Are you sure you want to delete ${entity}`)) {
                    throw new Error(`The user did not authorize deletion`)
                }
                const entityClassName = entity.className
                entity.remove()
                return `${entityClassName} with id ${id} is removed successfully`
            })

        toolbox.add(
            'getEntityState',
            'Returns information about a particular Provider, Consumer, Service, Task, Usage, Failure, Metric in JSON format.',
        )
            .prm('id:string*', 'The id of the entity to get the state of')
            .fn(({ id }) => {
                const entity = this.assessment.getEntityById(id)
                if (!entity) {
                    throw new Error(`Entity with id ${id} not found`)
                }
                return entity.state
            })

        toolbox.add(
            'updateEntity',
            'Updates the attributes of a particular Provider, Consumer, Service, Task, Usage, Failure, or Metric.',
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
                const entity = this.assessment.getEntityById(id)
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
                const newConsumer = this.assessment.consumers.pushNew(state)
                this.editingInstance = newConsumer
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
                const newProvider = this.assessment.providers.pushNew(state)
                this.editingInstance = newProvider
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
                const provider = this.assessment.providers.find(({ id }) => id === providerId)
                if (!provider) {
                    throw new Error(`Provider with id ${providerId} not found`)
                }
                const newService = provider.services.pushNew(state)
                this.editingInstance = newService
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
                const consumer = this.assessment.consumers.find(({ id }) => id === consumerId)
                if (!consumer) {
                    throw new Error(`Consumer with id ${consumerId} not found`)
                }
                const newTask = consumer.tasks.pushNew(state)
                this.editingInstance = newTask
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
                const service = this.assessment.services.find(({ id }) => id === serviceId)
                if (!service) {
                    throw new Error(`Service with id ${serviceId} not found`)
                }
                const newUsage = service.usages.pushNew({ taskId })
                this.editingInstance = newUsage
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
                const usage = this.assessment.usages.find(({ id }) => id === usageId)
                if (!isInstance(usage, Usage)) {
                    throw new Error(`Could not find a usage with id "${usageId}"`)
                }
                const newFailure = usage.failures.pushNew(state)
                this.editingInstance = usage
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
            //.prm('failureIds:array', 'An list of failure ids that this metric helps measure')
            /*
            Need to support array property type
            "items": {
                "type": "string",
                "description": "A single failure id"
            }
            */
            .fn((options) => {
                const { serviceId, ...state } = options
                const service = this.assessment.services.find(({ id }) => id === serviceId)
                if (!service) {
                    throw new Error(`Service with id ${serviceId} not found`)
                }
                const newMetric = service.metrics.pushNew(state)
                this.editingInstance = newMetric
                return newMetric.id
            })

        toolbox.add(
            'clearAssessment',
            'Clear the assessment of all Providers, Consumers, Services, Tasks, Usages, Failures, and Metrics.',
        ).this(this).fn(this.clearAssessment)

        toolbox.add('getDateAndTime', 'Get the current date and time').fn(() => String(new Date()))

        const exportTabs = [
            'JSON',
            'Markdown',
            'Prolog',
            'Import',
        ]

        return {
            uploadedState: '',
            uploadedStateMessage: 'Not analyzed yet',
            thread,
            tools: toolbox,
            exportTabs,
            selExportTab: exportTabs[0],
            editingInstance: undefined,
        }
    },
    computed: {
        editingClassName() {
            return this.editingInstance?.constructor.name || ''
        },
    },
    methods: {
        showDialog(ref, modal) {
            this.$refs[ref].show(modal)
        },
        removeProvider(provider) {
            if (!isInstance(provider, Provider)) {
                throw new TypeError(`Expected an instance of Provider. Got ${provider}`)
            }
            provider.remove()
            this.editingInstance = undefined
        },
        removeConsumer(consumer) {
            if (!isInstance(consumer, Consumer)) {
                throw new TypeError(`Expected an instance of Consumer. Got ${consumer}`)
            }
            consumer.remove()
            this.editingInstance = undefined
        },
        removeTask(task) {
            if (!isInstance(task, Task)) {
                throw new TypeError(`Expected an instance of Task. Got ${task}`)
            }
            const { consumer } = task
            task.remove()
            this.editingInstance = consumer
        },
        removeService(service) {
            if (!isInstance(service, Service)) {
                throw new TypeError(`Expected an instance of Service. Got ${service}`)
            }
            const { provider } = service
            service.remove()
            this.editingInstance = provider
        },
        removeUsage(usage) {
            if (!isInstance(usage, Usage)) {
                throw new TypeError(`Expected an instance of Usage. Got ${usage}`)
            }
            const { service } = usage
            usage.remove()
            this.editingInstance = service
        },
        removeMetric(metric) {
            if (!isInstance(metric, Metric)) {
                throw new TypeError(`Expected an instance of Metric. Got ${metric}`)
            }
            const { service } = metric
            metric.remove()
            this.editingInstance = service
        },
        assignUploadedState(dialogRef) {
            try {
                this.uploadedStateMessage = 'Analyzing...'
                const state = JSON.parse(this.uploadedState)
                this.uploadedStateMessage = 'State parsed as JSON'
                const tmpAssessment = new Assessment(state)
                this.uploadedStateMessage = `State tested successfully`
                console.log(`Loaded assessment state ${tmpAssessment}`)
                this.assessment.state = state
                this.uploadedStateMessage = `State loaded successfully`
                this.$refs[dialogRef].close()
            } catch (error) {
                this.uploadedStateMessage = `Failed to load assessment state: ${error}`
            }
        },
        clearAssessment() {
            const message = [
                'This will remove all Providers, Consumers, Services, Tasks, Usages, Failures, and Metrics.',
                'Are you sure you want to clear the assessment?',
            ].join(' ')
            if (confirm(message)) {
                this.editingInstance = undefined
                this.assessment.clear()
            }
        },
    },
}
