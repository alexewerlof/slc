import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { ExtLink } from '../../components/ext-link.js'
import { FeedbackBlobComponent } from '../../components/feedback-blob-component.js'
import { HeaderComponent } from '../../components/header-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { CookiePopupComponent } from '../../components/cookie-popup-component.js'
import { HelpComponent } from '../../components/help-component.js'
import { CodeBlockComponent } from '../../components/code-block-component.js'
import { percentToRatio } from '../../lib/math.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../../lib/fmt.js'
import { stateToUrl } from '../../lib/share.js'
import { CalculatorComponent } from '../../components/calculator-component.js'
import { Calculator } from '../../components/calculator.js'

export const app = createApp({
    data() {
        const calculator = new Calculator({
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
            // The SLI object
            // Show the announcement banner
            showAnnouncement: true,
            // The text shown in the toast notification
            toastCaption: '',
            // The calculator view state
            calculator,
            state: 'Press update',
        }
    },
    mounted() {
        this.$nextTick(() => {
            const hash = globalThis.location.hash
            if (hash) {
                const element = document.querySelector(hash)
                if (element) element.scrollIntoView()
            }
        })
    },
    components: {
        CalculatorComponent,
        CookiePopupComponent,
        ExtLink,
        FeedbackBlobComponent,
        FooterComponent,
        HeaderComponent,
        HelpComponent,
        CodeBlockComponent,
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

app.mount('#app')
