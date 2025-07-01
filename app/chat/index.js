import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { FileBead, Thread } from '../../components/llm/thread.js'
import { loadJson } from '../../lib/share.js'

const manifest = await loadJson('manifest.json')

export const app = createApp({
    data() {
        return {
            manifest,
            test: 'test',
            thread: new Thread(
                new FileBead(
                    new URL('chat-prompt.md', globalThis.location),
                    new URL('../../prompts/glossary.md', globalThis.location),
                ),
            ),
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
