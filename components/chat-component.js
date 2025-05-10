import { showToast } from '../lib/toast.js'
import { LLMAPI } from './llm/llm-api.js'

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
    engines: [
        /*
        {
            name: 'WebLLM',
            baseUrl: undefined,
            website: 'https://webllm.mlc.ai/',
            description:
                'The easiest option. It runs the LLM engine in this browser window and caches the model for later usage.',
        },
        */
        {
            name: 'LM Studio',
            baseUrl: 'http://localhost:1234/v1/',
            website: 'https://lmstudio.ai/',
            description: 'Runs on a local computer. You need to configure a local server to be able to use it.',
            suggestedModel: 'phi-4',
        },
        {
            name: 'Jan',
            baseUrl: 'http://localhost:1337/v1/',
            website: 'https://jan.ai/',
            description: 'Similar to LM Studio but with a simpler user interface.',
            suggestedModel: 'llama3.1-8b-instruct',
        },
        {
            name: 'Gemini',
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
            website: 'https://gemini.google.com',
            description: 'from Google which arguably started this whole AI thingie by their Transformers architecture.',
            apiKeyWebsite: 'https://aistudio.google.com/apikey',
            suggestedModel: 'models/gemini-2.0-flash:generateContent',
        },
        {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1/',
            website: 'https://chatgpt.com/',
            description: 'The company behind ChatGPT and run by a lunatic.',
            apiKeyWebsite: 'https://platform.openai.com/api-keys',
            suggestedModel: 'o4-mini',
        },
        {
            name: 'Claude',
            baseUrl: 'https://api.anthropic.com/v1/',
            website: 'https://claude.ai/',
            description: 'Similar to OpenAI, run by some former OpenAI employees.',
            apiKeyWebsite: 'https://console.anthropic.com/settings/keys',
            suggestedModel: 'claude-3-5-haiku-20241022',
        },
    ],
}

export default {
    data() {
        const engineSelection = config.engines.map((engine) => {
            return {
                title: engine.name,
                value: new LLMAPI(engine),
            }
        })
        const tabNames = ['Settings', 'Chat']
        return {
            engines: config.engines,
            engineSelection,
            selectedEngine: engineSelection[0].value,
            isEditDisabled: false,
            temperature: config.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.maxTokens.default,
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
                this.isEditDisabled = true
                const response = await this.selectedEngine.getCompletion(this.messages, {
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
