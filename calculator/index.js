import { createApp } from '../vendor/vue.js'
import { config } from '../config.js'
import ExtLink from '../components/ext-link.js'
import FeedbackBlobComponent from '../components/feedback-blob.js'
import HeaderComponent from '../components/header.js'
import FooterComponent from '../components/footer.js'
import CookiePopupComponent from '../components/cookie-popup.js'
import HelpComponent from '../components/help.js'
import { percentToRatio } from '../lib/math.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { trackEvent } from '../lib/ga-utils.js'
import { copyElementTextToClipboard, stateToUrl } from '../lib/share.js'
import { Indicator } from '../models/indicator.js'
import { Objective } from '../models/objective.js'
import { Alert } from '../models/alert.js'
import CalculatorViewComponent from '../views/calculator-view.js'
import { Calculator } from '../models/calculator.js'

export const app = createApp({
    data() {
        const indicator = new Indicator()

        const objective = new Objective(indicator)
        
        const alert = new Alert(objective)

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
            calculator: new Calculator(),
        }
    },
    mounted() {
        this.$nextTick(() => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) element.scrollIntoView();
            }
        })
    },
    components: {
        CalculatorViewComponent,
        CookiePopupComponent,
        ExtLink,
        FeedbackBlobComponent,
        FooterComponent,
        HeaderComponent,
        HelpComponent,
    },
    methods: {
        boundCaption,
        entity2symbol,
        hasComparators,
        numL10n,
        percentToRatio,
        percL10n,
        async copy(elementId, label) {
            try {
                await copyElementTextToClipboard(elementId)
                this.toastCaption = 'Copied to clipboard!'
                trackEvent('copy', 'button', label)
            } catch(err) {
                // ignore
            }
        },
    },
    computed: {
        shareUrl() {
            try {
                const url = new URL(window.location.pathname, window.location.origin)
                return stateToUrl(url, this).toString()
            } catch (e) {
                console.error('Could not create shareurl', e)
                return null
            }
        },
    }
})

app.mount('#app')
