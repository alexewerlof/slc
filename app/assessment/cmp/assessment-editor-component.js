import * as YAML from '../../../dependencies/yaml.js'
import { Assessment } from '../../../components/assessment.js'
import { Service } from '../../../components/service.js'
import { UserPromptBead } from '../../../components/llm/thread.js'
import { isInstance } from '../../../lib/validation.js'
import { loadJson, parseStateString, stateToCurrentUrl } from '../../../lib/share.js'
import { showToast } from '../../../lib/toast.js'
import { Agent } from '../../../components/llm/agent.js'
import { createThread } from './assessment-thread.js'
import { createToolbox } from './assessment-toolbox.js'
import { Entity } from '../../../lib/entity.js'
import { exampleFiles } from '../example-file-names.js'
import { LLM } from '../../../components/llm/llm.js'

const exampleStates = await Promise.all(exampleFiles.map((fileName) => loadJson(fileName)))

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        const llm = new LLM(true)
        const agent = new Agent(llm, createThread(this), createToolbox(this))

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
        /**
         * Opens the named dialog ref.
         * @param {string} ref the Vue template ref name of the dialog element
         * @param {boolean} [modal]
         */
        showDialog(ref, modal) {
            this.$refs[ref].show(modal)
        },
        /**
         * Prompts the user for confirmation and removes the given entity from the assessment.
         * Falls back to the current `editingInstance` when no target is passed.
         * @param {import('../../../lib/entity.js').Entity} [target] the entity to remove
         * @returns {boolean} true when the entity was successfully removed
         */
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
        /**
         * Parses the uploaded state string, validates it against a temporary Assessment,
         * and applies it to the active assessment.
         * @returns {Promise<void>}
         */
        async assignUploadedState() {
            this.uploadedStateMessage = 'Parsing...'
            try {
                const parsedState = await parseStateString(this.uploadedState)
                this.uploadedStateMessage = 'State parsed successfully. Smoke testing...'
                const _tmpAssessment = new Assessment(parsedState)
                this.uploadedStateMessage = 'State is valid'
                this.assessment.state = parsedState
                this.uploadedStateMessage = 'State loaded successfully'
                this.editingInstance = this.assessment
            } catch (err) {
                this.uploadedStateMessage = `Invalid state: ${err}`
            }
        },
        /**
         * Validates the given state object against a temporary Assessment and, if valid,
         * applies it to the active assessment.
         * @param {Object} state
         */
        loadState(state) {
            try {
                const _tmpAssessment = new Assessment(state)
                this.assessment.state = state
                this.editingInstance = this.assessment
            } catch (error) {
                showToast(`Failed to load assessment state: ${error}`)
            }
        },
        /**
         * Prompts the user for confirmation, then clears all entities from the assessment.
         */
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
        /**
         * Serialises an object to a YAML string.
         * @param {Object} obj
         * @returns {string}
         */
        toYaml(obj) {
            return YAML.stringify(obj)
        },
        /**
         * Uses the AI agent to suggest and add a new Metric to the currently selected Service.
         * @returns {Promise<void>}
         */
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
