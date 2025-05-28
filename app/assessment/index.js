import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Assessment } from '../../components/assessment.js'
import { loadJson } from '../../lib/share.js'
import { registerComponents } from '../../lib/component-loader.js'

const [manifest, exampleJson] = await Promise.all([
    loadJson('manifest.json'),
    loadJson('example.json'),
])

export const app = createApp({
    data() {
        const assessment = new Assessment(exampleJson)

        return {
            manifest,
            assessment,
        }
    },
})

const componentSpecifications = [
    './cmp/assessment-editor-component.jhc',
]

await registerComponents(app, componentSpecifications, import.meta.resolve)
await registerAllComponents(app)
app.mount('#app')
