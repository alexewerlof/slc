import { showToast } from '../lib/toast.js'

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
                    needsApiKey: false,
                },
            },
            {
                disabled: true,
                title: 'WebLLM',
                value: {
                    id: 'webllm',
                    needsApiKey: false,
                },
            },
            {
                title: 'Jan',
                value: {
                    id: 'jan',
                    needsApiKey: false,
                },
            },
            {
                title: 'Claude',
                value: {
                    id: 'claude',
                    needsApiKey: true,
                },
            },
            {
                title: 'Gemini',
                value: {
                    id: 'gemini',
                    needsApiKey: true,
                },
            },
            {
                title: 'OpenAI',
                value: {
                    id: 'openai',
                    needsApiKey: true,
                },
            },
        ]
        return {
            apiKey: '',
            engines,
            selectedEngine: engines[0].value,
            isEditDisabled: false,
            temperature: config.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.maxTokens.default,
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
                const engine = await import(`../lib/llm/${this.selectedEngine.id}.js`)
                this.messages.push({ role: 'user', content: this.message })
                this.message = ''
                this.isEditDisabled = true
                const response = await engine.getCompletion(this.messages, {
                    // model: 'models/gemini-2.0-flash:generateContent',
                    model: 'phi-4',
                    apiKey: this.apiKey,
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
