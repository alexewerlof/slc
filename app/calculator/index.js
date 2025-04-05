import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { percentToRatio } from '../../lib/math.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../../lib/fmt.js'
import { stateToUrl } from '../../lib/share.js'
import { makeCalculator } from '../../components/calculator.js'
import { attachBeforeUnloadHandler } from '../../lib/browser.js'
import { addComponents } from '../../lib/fetch-template.js'

export const app = createApp({
    data() {
        const calculator = makeCalculator(globalThis.location.href, {
            indicators: [{
                metricName: 'response_latency1',
                metricUnit: 'ms',
                expectedDailyEvents: 8000,
                lowerBound: 'gt',
                upperBound: 'le',
                timeslice: 60,
                objectives: [{
                    target: 99,
                    windowDays: 30,
                    lowerThreshold: 5,
                    upperThreshold: 2000,
                    alerts: [{
                        burnRate: 6,
                        longWindowPerc: 17.6,
                    }],
                }],
            }],
        })

        return {
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
        }, 60000)
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
            this.state = this.calculator.save()
        },
    },
    computed: {
        shareUrl() {
            try {
                const url = new URL(
                    globalThis.location.pathname,
                    globalThis.location.origin,
                )
                return stateToUrl(url, this.calculator.save()).toString()
            } catch (e) {
                console.error('Could not create shareurl', e)
                return null
            }
        },
    },
})

addComponents(app)
app.mount('#app')
