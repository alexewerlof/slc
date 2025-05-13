import { config } from '../config.js'
import { showToast } from '../lib/toast.js'
import { LLMAPI } from './llm/llm-api.js'

export default {
    data() {
        const engineSelection = config.llm.engines.map((engine) => {
            return {
                title: engine.name,
                value: new LLMAPI(engine),
            }
        })
        const tabNames = ['Settings', 'Chat']
        return {
            engines: config.llm.engines,
            engineSelection,
            selectedEngine: engineSelection[0].value,
            isEditDisabled: false,
            temperature: config.llm.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.llm.maxTokens.default,
            tabNames,
            selTabName: tabNames[0],
            config,
        }
    },
    props: {
        messages: {
            type: Array,
            required: true,
        },
    },
    methods: {
        async submitPrompt() {
            try {
                this.messages.push({ role: 'user', content: this.message })
                this.message = ''
                this.selTabName = this.tabNames[1]
                this.isEditDisabled = true
                const response = await this.selectedEngine.getCompletion(this.messages, {
                    temperature: this.temperature,
                    maxTokens: this.maxTokens,
                })
                this.messages.push(response)
            } catch (error) {
                console.error('Error:', error)
                showToast('Error: ' + error.message)
            }
            this.isEditDisabled = false
        },
    },
}
