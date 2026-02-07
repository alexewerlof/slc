import { config } from '../../config.js'
import { isStrLen, isUrlStr } from '../../lib/validation.js'
import { LLM } from './llm.js'
import { verifyModelEndpoint, verifyToolsCall, verifyWordEcho } from './llm-verifications.js'

export default {
    data() {
        return {
            llmClone: this.modelValue.clone(),
            modelIds: [],
            logs: [],
            selectedEngine: null,
            fetchModelError: '',
            verifiedState: undefined,
            apiKeyVisible: false,
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
        isVerified() {
            return this.llmClone.isStateEqualTo(this.verifiedState)
        },
        apiKeyInputType() {
            return this.apiKeyVisible ? 'text' : 'password'
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
            const logCallback = this.addLog.bind(this)
            try {
                this.clearLogs()
                await verifyModelEndpoint(this.llmClone, logCallback)
                await verifyWordEcho(this.llmClone, logCallback)
                await verifyToolsCall(this.llmClone, logCallback)
                this.verifiedState = this.llmClone.state
                console.debug(this.verifiedState)
                logCallback('☑️ You can save your settings now.')
            } catch (error) {
                console.error(error)
                logCallback(String(error))
            }
        },
        save() {
            this.modelValue.state = this.llmClone.state
            this.modelValue.save()
            this.$emit('update:modelValue', this.modelValue)
            console.debug('Saved in browser storage.')
        },
    },
}
