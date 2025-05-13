import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { fetchMessage } from '../../lib/prompt.js'

const systemPrompt = await fetchMessage('system', 'chat-prompt.md', '../../prompts/glossary.md')

export const app = createApp({
    data() {
        return {
            messages: [
                systemPrompt,
            ],
            message: 'Can you briefly say what is the difference between SLO and SLA?',
        }
    },
    props: {
        messages: {
            type: Array,
            required: true,
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
