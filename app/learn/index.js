import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { loadJson } from '../../lib/share.js'

const manifest = await loadJson('manifest.json')

export const app = createApp({
    data() {
        return {
            manifest,
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
