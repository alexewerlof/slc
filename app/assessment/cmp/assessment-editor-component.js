import { Assessment } from '../../../components/assessment.js'
import { Service } from '../../../components/service.js'
import { UserPromptBead } from '../../../components/llm/thread.js'
import { isInstance } from '../../../lib/validation.js'
import { loadJson, stateToCurrentUrl } from '../../../lib/share.js'
import { showToast } from '../../../lib/toast.js'
import { Agent } from '../../../components/llm/agent.js'
import { createThread } from './assessment-thread.js'
import { createToolbox } from './assessment-toolbox.js'
import { Entity } from '../../../lib/entity.js'

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
    methods: {
        stateToCurrentUrl,
        showDialog(ref, modal) {
            this.$refs[ref].show(modal)
        },
        removeEditingInstance(target = this.editingInstance) {
            if (!(target instanceof Entity)) {
                return false
            }
            if (!confirm(`Are you sure you want to remove the selected ${target.className}?`)) {
                return false
            }
            switch (target.className) {
                case 'Assessment':
                    this.editingInstance = this.assessment
                    break
                case 'Provider':
                    this.editingInstance = this.assessment
                    break
                case 'Consumer':
                    this.editingInstance = this.assessment
                    break
                case 'Service':
                    this.editingInstance = target.provider
                    break
                case 'Task':
                    this.editingInstance = target.consumer
                    break
                case 'Usage':
                    this.editingInstance = target.service
                    break
                case 'Failure':
                    this.editingInstance = target.usage
                    break
                case 'Metric':
                    this.editingInstance = target.service
                    break
                default:
                    console.log(`Unsupported removing entity className: ${target.className}`)
                    return false
            }
            target.remove()
            return true
        },
        assignUploadedState() {
            try {
                this.uploadedStateMessage = 'Analyzing...'
                this.loadState(JSON.parse(this.uploadedState))
                this.uploadedStateMessage = `State loaded successfully`
            } catch (error) {
                this.uploadedStateMessage = `Failed to load assessment state: ${error}`
            }
        },
        loadState(state) {
            try {
                const _tmpAssessment = new Assessment(state)
                this.assessment.state = state
                this.editingInstance = this.assessment
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
