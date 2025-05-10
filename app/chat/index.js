import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'

const systemPrompt = await (await fetch('/prompts/slo-expert-head.txt')).text()

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
