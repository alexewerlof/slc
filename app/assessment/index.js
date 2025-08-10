import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Assessment } from '../../components/assessment.js'
import { currentUrlToState } from '../../lib/share.js'
import { registerComponents } from '../../lib/component-loader.js'
import { Store } from '../../lib/store.js'

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
                this.store.state = this.assessment.state
            },
            deep: true,
        },
    },
})

const componentSpecifications = [
    './cmp/assessment-editor-component.jh',
]

await registerComponents(app, componentSpecifications, import.meta.resolve)
await registerAllComponents(app)
app.mount('#app')
