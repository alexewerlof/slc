import { showToast } from '../lib/toast.js'
import { LMStudio } from './llm/lmstudio.js'

const config = {
    temperature: {
        default: 0.1,
        min: 0,
        max: 2,
        step: 0.1,
    },
    maxTokens: {
        default: 1000,
        min: 100,
        max: 10000,
        step: 100,
    },
}

export default {
    data() {
        const engines = [
            {
                title: 'LM Studio',
                value: {
                    id: 'lmstudio',
                    instance: new LMStudio(),
                },
            },
            /*
            {
                disabled: true,
                title: 'WebLLM',
                value: {
                    id: 'webllm',
                    instance: LMStudio,
                },
            },
            {
                title: 'Jan',
                value: {
                    id: 'jan',
                    instance: LMStudio,
                },
            },
            {
                title: 'Claude',
                value: {
                    id: 'claude',
                    instance: LMStudio,
                },
            },
            {
                title: 'Gemini',
                value: {
                    id: 'gemini',
                    instance: LMStudio,
                },
            },
            {
                title: 'OpenAI',
                value: {
                    id: 'openai',
                    instance: LMStudio,
                },
            },
            */
        ]
        return {
            engines,
            selectedEngine: engines[0].value,
            isEditDisabled: false,
            temperature: config.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.maxTokens.default,
            lmstudio: new LMStudio(),
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
                this.isEditDisabled = true
                const response = await this.selectedEngine.instance.getCompletion(this.messages, {
                    // TODO: Gemini model: 'models/gemini-2.0-flash:generateContent',
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
