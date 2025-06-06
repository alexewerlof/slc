import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { loadJson, loadText } from '../../lib/share.js'

const [manifest, glossary] = await Promise.all([
    loadJson('manifest.json'),
    loadText('../../prompts/glossary.md'),
])

export const app = createApp({
    data() {
        return {
            manifest,
            glossary,
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
