import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { showToast } from '../../lib/toast.js'
import { Gemini } from '../../lib/gemini.js'

export const app = createApp({
    data() {
        return {
            apiKey: '',
            isEditDisabled: false,
            messages: [{
                role: 'system',
                content: 'You are a SRE expert with deep knowledge about SLI, SLO, and SLA.',
            }],
            message: 'Can you briefly say what is the difference between SLO and SLA?',
        }
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
})

await registerAllComponents(app)
app.mount('#app')
