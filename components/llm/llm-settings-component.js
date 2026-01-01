import { config } from '../../config.js'
import { isStrLen, isUrlStr } from '../../lib/validation.js'
import { LLM } from './llm.js'

export default {
    data() {
        return {
            llmClone: this.modelValue.clone(),
            modelIds: [],
            logs: [],
            selectedEngine: null,
            fetchModelError: '',
        }
    },
    props: {
        modelValue: {
            type: LLM,
            required: true,
        },
    },
    computed: {
        config() {
            return config
        },
    },
    methods: {
        async updateModelIds() {
            try {
                this.modelIds = await this.llmClone.getModelIds()
                this.fetchModelError = ''
            } catch (error) {
                console.error(String(error))
                this.fetchModelError = String(error)
            }
        },
        prefillSelectedEngine() {
            const { baseUrl, apiKeyWebsite, suggestedModel } = this.selectedEngine
            this.llmClone.baseUrl = baseUrl
            console.log(this.llmClone.baseUrl)
            this.llmClone.modelId = isStrLen(suggestedModel, 1) ? suggestedModel : this.modelIds[0]
            this.llmClone.useApiKey = isUrlStr(apiKeyWebsite)
            
        },
        clearLogs() {
            this.logs = []
        },
        addLog(str) {
            this.logs.push(str)
            console.debug(str)
        },
        async verify() {
            this.clearLogs()
            this.llmClone.verify(this.addLog.bind(this))
        },
        save() {
            this.modelValue.state = this.llmClone.state
            this.modelValue.save()
            this.$emit('update:modelValue', this.modelValue)
            console.debug('Saved in browser storage.')
        },
    },
}
