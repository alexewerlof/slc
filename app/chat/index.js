import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { FileBead, Thread } from '../../components/llm/thread.js'
import { Agent } from '../../components/llm/agent.js'

export const app = createApp({
    data() {
        const thread = new Thread(
            new FileBead(
                new URL('chat-prompt.md', globalThis.location),
                new URL('../../prompts/glossary.md', globalThis.location),
            ),
        )
        const agent = new Agent(thread)

        return {
            test: 'test',
            agent,
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
