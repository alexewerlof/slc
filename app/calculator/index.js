import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { percentToRatio } from '../../lib/math.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../../lib/fmt.js'
import { loadJson, stateToUrl } from '../../lib/share.js'
import { makeCalculator } from '../../components/calculator.js'
import { attachBeforeUnloadHandler } from '../../lib/browser.js'
import { registerAllComponents } from '../../components/index.js'

const manifest = await loadJson('manifest.json')

export const app = createApp({
    data() {
        const calculator = makeCalculator(globalThis.location.href)

        return {
            manifest,
            // Expose the config to the UI
            config,
            // For sharing and loading state to and from URL
            urlVer: config.urlVer,
            // The calculator view state
            calculator,
            state: 'Press update',
        }
    },
    mounted() {
        setTimeout(() => {
            attachBeforeUnloadHandler(globalThis)
        }, 600000)
        this.$nextTick(() => {
            const hash = globalThis.location.hash
            if (hash) {
                const element = document.querySelector(hash)
                if (element) {
                    element.scrollIntoView()
                }
            }
        })
    },
    methods: {
        boundCaption,
        entity2symbol,
        hasComparators,
        numL10n,
        percentToRatio,
        percL10n,
        updateState() {
            this.state = this.calculator.state
        },
    },
    computed: {
        shareUrl() {
            try {
                const url = new URL(
                    globalThis.location.pathname,
                    globalThis.location.origin,
                )
                return stateToUrl(url, this.calculator.state).toString()
            } catch (e) {
                console.error('Could not create shareurl', e)
                return null
            }
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
