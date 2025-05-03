import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'

export const app = createApp({
    data() {
        return {
            messages: [{
                role: 'system',
                content: 'You are a SRE expert with deep knowledge about SLI, SLO, and SLA.',
            }],
            message: 'Can you briefly say what is the difference between SLO and SLA?',
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
