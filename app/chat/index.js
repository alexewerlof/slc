import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { fetchPrompt } from '../../lib/prompt.js'

const systemPrompt = await fetchPrompt('/prompts/slo-expert-head.md')

export const app = createApp({
    data() {
        return {
            messages: [{
                role: 'system',
                content: systemPrompt,
            }],
            message: 'Can you briefly say what is the difference between SLO and SLA?',
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
