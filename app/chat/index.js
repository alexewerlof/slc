import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Bead, Thread } from '../../components/thread.js'
import { fetchTextFilesAndConcat } from '../../lib/prompt.js'
import { loadJson } from '../../lib/share.js'

const manifest = await loadJson('manifest.json')

const systemContent = await fetchTextFilesAndConcat(
    'chat-prompt.md',
    '../../prompts/glossary.md',
)

export const app = createApp({
    data() {
        return {
            manifest,
            test: 'test',
            thread: new Thread(new Bead('system', systemContent)),
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
