import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Assessment } from '../../components/assessment.js'
import { currentUrlToState, loadJson } from '../../lib/share.js'
import { registerComponents } from '../../lib/component-loader.js'

const manifest = await loadJson('manifest.json')

export const app = createApp({
    data() {
        const assessment = new Assessment()

        try {
            assessment.state = currentUrlToState()
        } catch (e) {
            console.warn('Using default because failed to load from URL:', e)
        }

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
