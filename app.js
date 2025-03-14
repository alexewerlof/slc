import { createApp } from './vendor/vue.js'
import { config } from './config.js'
import AlertChartComponent from './components/alert-chart.js'
import BurnRateComponent from './components/burn-rate.js'
import ErrorBudgetComponent from './components/error-budget.js'
import ExtLink from './components/ext-link.js'
import FeedbackBlobComponent from './components/feedback-blob.js'
import HeaderComponent from './components/header.js'
import FooterComponent from './components/footer.js'
import CookiePopupComponent from './components/cookie-popup.js'
import InlineSelectComponent from './components/inline-select.js'
import HelpComponent from './components/help.js'
import SLFractionComponent from './components/sl-fraction.js'
import { setTitle } from './lib/header.js'
import { percentToRatio } from './lib/math.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from './lib/fmt.js'
import { inRange, inRangePosInt, isStr } from './lib/validation.js'
import { trackEvent } from './lib/ga-utils.js'
import { copyElementTextToClipboard, stateToUrl, urlToState } from './lib/share.js'
import { Indicator } from './models/indicator.js'
import { Objective } from './models/objective.js'
import { Alert } from './models/alert.js'
import IndicatorViewComponent from './views/indicator-view.js'
import ObjectiveViewComponent from './views/objective-view.js'
import AlertViewComponent from './views/alert-view.js'

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
            // SLI
            indicator,
            // SLO
            objective,
            // Alert
            alert,
        }
    },
    watch: {
        /* TODO:
        windowDays(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.expectedTotalEvents = Math.round(this.expectedTotalEvents * newVal / oldVal)
            }
        },
        */
        title(newTitle) {
            setTitle(document, newTitle)
        },
        /** TODO
         * 
        lowerThreshold(newVal) {
            if (newVal > this.upperThreshold) {
                this.upperThreshold = newVal
            }
        },
        upperThreshold(newVal) {
            if (newVal < this.lowerThreshold) {
                this.lowerThreshold = newVal
            }
        },
        */
    },
    mounted() {
        this.loadState(urlToState(window.location.href))
        this.$nextTick(() => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) element.scrollIntoView();
            }
        })
    },
    components: {
        IndicatorViewComponent,
        ObjectiveViewComponent,
        AlertViewComponent,
        AlertChartComponent,
        BurnRateComponent,
        ErrorBudgetComponent,
        ExtLink,
        FeedbackBlobComponent,
        HeaderComponent,
        CookiePopupComponent,
        FooterComponent,
        HelpComponent,
        InlineSelectComponent,
        SLFractionComponent,
    },
    methods: {
        boundCaption,
        entity2symbol,
        hasComparators,
        numL10n,
        percentToRatio,
        percL10n,
        
        loadState(newState) {
            try {
                if (isStr(newState.title)) {
                    this.indicator.title = newState.title
                }
            
                if (isStr(newState.description)) {
                    this.indicator.description = newState.description
                }
            
                // Unit is a bit special. It can be the event name or a timeslice length in seconds
                if (inRangePosInt(newState.timeslice, config.timeslice.min, config.timeslice.max)) {
                    this.indicator.timeslice = newState.timeslice
                } else {
                    this.indicator.isTimeBased = false
                }
            
                if (isStr(newState.metricName)) {
                    this.indicator.metricName = newState.metricName
                }

                if (isStr(newState.metricUnit)) {
                    this.indicator.metricUnit = newState.metricUnit
                }

                if (config.lowerBound.possibleValues.includes(newState.lowerBound)) {
                    this.indicator.lowerBound = newState.lowerBound
                }

                if (config.upperBound.possibleValues.includes(newState.upperBound)) {
                    this.indicator.upperBound = newState.upperBound
                }
                
                if (isStr(newState.eventUnit)) {
                    this.indicator.eventUnit = newState.eventUnit
                }

                if (inRange(newState.lowerThreshold, config.lowerThreshold.min, config.lowerThreshold.max)) {
                    this.objective.lowerThreshold = newState.lowerThreshold
                }
                
                if (inRange(newState.upperThreshold, config.upperThreshold.min, config.upperThreshold.max)) {
                    this.objective.upperThreshold = newState.upperThreshold
                }
            
                if (inRange(newState.slo, config.slo.min, config.slo.max)) {
                    this.objective.target = newState.slo
                }
            
                if (inRangePosInt(newState.windowDays, config.windowDays.min, config.windowDays.max)) {
                    this.objective.windowDays = newState.windowDays
                }
            
                if (inRangePosInt(newState.expectedTotalEvents, config.expectedTotalEvents.min, config.expectedTotalEvents.max)) {
                    this.objective.expectedTotalEvents = newState.expectedTotalEvents
                }
            
                if (inRange(newState.burnRate, config.burnRate.min, config.burnRate.max)) {
                    this.alert.burnRate = newState.burnRate
                }
            
                if (inRange(newState.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
                    this.alert.longWindowPerc = newState.longWindowPerc
                }
            
                if (inRange(newState.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
                    this.alert.shortWindowDivider = newState.shortWindowDivider
                }
            } catch (e) {
                this.toastCaption = `Failed to load state ${e}`
                console.error(e)
            }
        },

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
