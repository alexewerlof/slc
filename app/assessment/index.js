import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Assessment } from '../../components/assessment.js'
import { currentUrlToState, loadJson } from '../../lib/share.js'
import { registerComponents } from '../../lib/component-loader.js'
import { Store } from '../../lib/store.js'

const manifest = await loadJson('manifest.json')

export const app = createApp({
    data() {
        const store = new Store('assessment-current-state', true)

        const assessment = new Assessment()

        const url = new URL(globalThis.location.href)
        if (url.searchParams.has('urlVer')) {
            try {
                assessment.state = currentUrlToState()
            } catch (e) {
                console.warn('Using default because failed to load from URL:', e)
            }
        }

        return {
            manifest,
            assessment,
            store,
        }
    },
    mounted() {
        const url = new URL(globalThis.location.href)
        if (url.searchParams.has('urlVer')) {
            try {
                assessment.state = currentUrlToState()
            } catch (e) {
                console.warn('Failed to load from URL:', e)
            }
        } else if (this.store.hasStoredValue) {
            this.assessment.state = this.store.state
        }
    },
    watch: {
        assessment: {
            handler() {
                console.log('Assessment changed:', this.assessment.state)
                this.store.state = this.assessment.state
            },
            deep: true,
        },
    },
})

const componentSpecifications = [
    './cmp/assessment-editor-component.jhc',
]

await registerComponents(app, componentSpecifications, import.meta.resolve)
await registerAllComponents(app)
app.mount('#app')
