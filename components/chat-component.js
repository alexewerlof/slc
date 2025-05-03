import { Gemini } from '../lib/llm/gemini.js'
import { showToast } from '../lib/toast.js'

const config = {
    temperature: {
        default: 0.1,
        min: 0,
        max: 2,
        step: 0.1,
    },
}

export default {
    data() {
        const engines = [
            {
                title: 'LM Studio',
                value: {
                    id: 'lm_studio',
                },
            },
            {
                disabled: true,
                title: 'WebLLM',
                value: {
                    id: 'webllm',
                },
            },
            {
                title: 'Claude',
                value: {
                    id: 'claude',
                },
            },
            {
                title: 'Gemini',
                value: {
                    id: 'gemini',
                },
            },
            {
                title: 'Jan',
                value: {
                    id: 'jan',
                },
            },
            {
                title: 'OpenAI',
                value: {
                    id: 'openai',
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
                const gemini = new Gemini(this.apiKey)
                this.messages.push({ role: 'user', content: this.message })
                this.message = ''
                this.isEditDisabled = true
                const response = await gemini.getCompletion(this.messages, {
                    temperature: 0.1,
                    maxOutputTokens: 1000,
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
