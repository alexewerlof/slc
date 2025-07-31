import { Assessment } from '../../../components/assessment.js'
import { Consumer } from '../../../components/consumer.js'
import { Task } from '../../../components/task.js'
import { Usage } from '../../../components/usage.js'
import { Metric } from '../../../components/metric.js'
import { Provider } from '../../../components/provider.js'
import { Service } from '../../../components/service.js'
import { UserPromptBead } from '../../../components/llm/thread.js'
import { isInstance } from '../../../lib/validation.js'
import { loadJson, stateToCurrentUrl } from '../../../lib/share.js'
import { showToast } from '../../../lib/toast.js'
import { Agent } from '../../../components/llm/agent.js'
import { createThread } from './assessment-thread.js'
import { createToolbox } from './assessment-toolbox.js'

const exampleFiles = [
    'be-fe-example.json',
    'gox-example.json',
    'hn-example.json',
]

const exampleStates = await Promise.all(exampleFiles.map((fileName) => loadJson(fileName)))

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        const agent = new Agent(createThread(this), createToolbox(this))

        return {
            uploadedState: '',
            uploadedStateMessage: 'Not analyzed yet',
            exampleStates,
            selImportTab: undefined,
            selExportTab: undefined,
            editingInstance: this.assessment,
            agent,
        }
    },
    computed: {
        editingClassName() {
            return this.editingInstance?.constructor.name || ''
        },
    },
    methods: {
        stateToCurrentUrl,
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
        assignUploadedState() {
            try {
                this.uploadedStateMessage = 'Analyzing...'
                const state = JSON.parse(this.uploadedState)
                this.uploadedStateMessage = 'State parsed as JSON'
                const _tmpAssessment = new Assessment(state)
                this.uploadedStateMessage = `State smoke test: loaded successfully`
                this.loadState(state)
                this.uploadedStateMessage = `State loaded successfully`
            } catch (error) {
                this.uploadedStateMessage = `Failed to load assessment state: ${error}`
            }
        },
        loadState(state) {
            try {
                this.assessment.state = state
            } catch (error) {
                showToast(`Failed to load assessment state: ${error}`)
            }
        },
        clearAssessment() {
            const message = [
                'This will remove all Providers, Consumers, Services, Tasks, Usages, Failures, and Metrics.',
                'Are you sure you want to clear the assessment?',
            ].join(' ')
            if (confirm(message)) {
                this.editingInstance = this.assessment
                this.assessment.clear()
            }
        },
        async addMetricUsingAI() {
            const service = this.editingInstance
            if (!isInstance(service, Service)) {
                throw new TypeError(`Expected an instance of Service. Got ${service}`)
            }
            if (!service.failures.length) {
                throw new Error(`Service ${service} has no failures to set metrics after them`)
            }
            const prompt = new UserPromptBead(
                `Use the available tools to add a new Metric to this Service:`,
                `**${service}**`,
                '',
                `The metric should measure at least one of the following failures:`,
                ...service.failures.map((failure) => `- ${failure}`),
                '',
                `Make sure to connect the metric to the relevant failures using its 'failureIds' property.`,
                `Only link the failures that can be detected using your suggested metric, nothing else.`,
                '',
            )
            if (service.metrics.length) {
                prompt.add(
                    `Your new metric should not overlap with any of the existing metrics:`,
                    ...service.metrics.map((metric) => `- ${metric}`),
                    '',
                )
            }
            prompt.add(
                `Don't ask my permission or confirmation.`,
                `Just go ahead and use the tools to create the metric and I'll verify your work afterwards.`,
            )
            this.agent.thread.add(prompt)
            await this.agent.completeThread()
        },
    },
}
