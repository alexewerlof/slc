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
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import { daysToSeconds, humanTimeSlices, secondsToDays } from './lib/time.js'
import { Window } from './lib/window.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from './lib/fmt.js'
import { inRange, inRangePosInt, isNum, isStr } from './lib/validation.js'
import { trackEvent } from './lib/ga-utils.js'
import { copyElementTextToClipboard, stateToUrl, urlToState } from './lib/share.js'
import { Budget } from './lib/budget.js'

export const app = createApp({
    data() {
        const indicator = {
            // The title of the SLI
            title: config.title.default,
            // The description of the SLI
            description: config.description.default,
            // definition of valid events for event-based SLIs
            eventUnit: config.eventUnit.default,
            // length of timeslice for time based SLIs. When it is negative, it indicates event based SLIs
            timeslice: config.timeslice.default,
            // the metric that indicates whether an event or timeslice is good
            metricName: config.metricName.default,
            // The unit of the metric that is used to identify good events
            metricUnit: config.metricUnit.default,
            // The type of lower bound for the metric values that indicate a good event
            lowerBound: config.lowerBound.default,
            // The type of upper bound for the metric values that indicate a good event
            upperBound: config.upperBound.default,
            // whether the SLI is time-based or event-based
            get isTimeBased() {
                return this.timeslice > 0
            },
            set isTimeBased(newIsTimeBased) {
                this.timeslice = newIsTimeBased ? Math.abs(this.timeslice) : -Math.abs(this.timeslice)
            },
            get eventUnitNorm() {
                    return this.isTimeBased ? humanTimeSlices(this.timeslice) : this.eventUnit
            },
            // Is there any bound
            isBounded() {
                return Boolean(this.lowerBound || this.upperBound)
            },
        }

        const objective = {
            indicator,
            // The SLO percentage. It is also read/written by the sloInt and sloFrac computed properties
            target: config.slo.default,
            get targetInt() {
                return Math.floor(this.target)
            },
            set targetInt(newIntStr) {
                const newInt = Number(newIntStr)
                const currTargetFrac = this.target % 1
                this.target = toFixed(newInt + currTargetFrac)
            },
            get targetFrac() {
                return toFixed(this.target % 1)
            },
            set targetFrac(newFracStr) {
                const newFrac = Number(newFracStr)
                const currTargetInt = Math.floor(this.target)
                this.target = toFixed(currTargetInt + newFrac)
            },
            get errorBudget() {
                return toFixed(100 - this.target)
            },
            get windowDays() {
                return secondsToDays(this.window.sec)
            },
            // The length of the SLO window in days
            set windowDays(days) {
                this.window.sec = daysToSeconds(days)
            },
            window: new Window(
                indicator,
                daysToSeconds(config.windowDays.default),
            ),
            // Lower bound threshold
            lowerThreshold: config.lowerThreshold.default,
            // Upper bound threshold
            upperThreshold: config.upperThreshold.default,
            // Allows fine tuning the target by adding or removing a small amount
            changeTarget(amount) {
                this.target = clamp(toFixed(this.target + amount), config.slo.min, config.slo.max)
            },
            lowerThresholdMax() {
                return this.indicator.upperBound ? this.upperThreshold : config.lowerThreshold.max
            },
            upperThresholdMin() {
                return this.indicator.lowerBound ? this.lowerThreshold : config.upperThreshold.min
            },
        }
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
            // Alert burn rate: the rate at which the error budget is consumed
            burnRate: config.burnRate.default,
            // Long window alert: percentage of the SLO window
            longWindowPerc: config.longWindowPerc.default,
            // Short window alert: the fraction of the long window
            shortWindowDivider: config.shortWindowDivider.default,
            // Show the short window alert
            useShortWindow: false,
            // For event based error budgets, this number holds the total valid events so we can compute the amount of allowed bad events
            estimatedValidEvents: config.estimatedValidEvents.default,
            // The cost of a bad event
            badEventCost: config.badEventCost.default,
            // The unit of the bad event cost
            badEventCurrency: config.badEventCurrency.default,
        }
    },
    watch: {
        /* TODO:
        windowDays(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.estimatedValidEvents = Math.round(this.estimatedValidEvents * newVal / oldVal)
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

        changeErrorBudget(amount) {
            // Event based
            const newBadEventCount = clamp(this.badEventCount + amount, 1, this.validEventCount)
            const newGoodEventCount = this.validEventCount - newBadEventCount
            const newSLO = toFixed(newGoodEventCount / this.validEventCount * 100)
            this.objective.target = clamp(newSLO, config.slo.min, config.slo.max)
        },
        
        loadState(newState) {
            try {
                if (isStr(newState.title)) {
                    this.title = newState.title
                }
            
                if (isStr(newState.description)) {
                    this.description = newState.description
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
            
                if (inRangePosInt(newState.estimatedValidEvents, config.estimatedValidEvents.min, config.estimatedValidEvents.max)) {
                    this.estimatedValidEvents = newState.estimatedValidEvents
                }
            
                if (inRange(newState.badEventCost, config.badEventCost.min, config.badEventCost.max)) {
                    this.badEventCost = newState.badEventCost
                }
            
                if (isStr(newState.badEventCurrency)) {
                    this.badEventCurrency = newState.badEventCurrency
                }
            
                if (inRange(newState.burnRate, config.burnRate.min, config.burnRate.max)) {
                    this.burnRate = newState.burnRate
                }
            
                if (inRange(newState.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
                    this.longWindowPerc = newState.longWindowPerc
                }
            
                if (inRange(newState.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
                    this.shortWindowDivider = newState.shortWindowDivider
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
        validEventCount() {
            if (this.indicator.isTimeBased) {
                return this.objective.window.countTimeslices
            } else {
                return this.estimatedValidEvents || config.estimatedValidEvents.min
            }
        },

        goodEventCount() {
            return this.validEventCount - this.badEventCount
        },

        badEventCount() {
            return Math.floor(percent(this.objective.errorBudget, this.validEventCount))
        },

        errorBudget() {
            const { sec } = this.objective.window
            const eventCost = this.badEventCost || 0
            return new Budget(this.indicator, sec, this.badEventCount, eventCost, this.badEventCurrency)
        },

        // Time to burn the entire error budget at the given burnRate
        errorBudgetBurn() {
            return this.errorBudget.shrinkSec(100 / this.burnRate)
        },

        // If nothing is done to stop the failures, there'll be burnRate times more errors by the end of the SLO window
        sloWindowBudgetBurn() {
            const { sec } = this.objective.window
            const eventCost = this.badEventCost || 0
            const burnedEventAtThisRate = Math.ceil(this.badEventCount * this.burnRate)
            const eventCount = Math.min(this.validEventCount, burnedEventAtThisRate)
            return new Budget(this.indicator, sec, eventCount, eventCost, this.badEventCurrency)
        },

        alertLongWindow() {
            return this.errorBudgetBurn.shrink(this.longWindowPerc)
        },

        alertTTRWindow() {
            return this.errorBudgetBurn.shrink(100 - this.longWindowPerc)
        },

        // As a percentage of the error budget
        alertShortWindowPerc() {
            return toFixed(this.longWindowPerc / this.shortWindowDivider)
        },

        alertShortWindow() {
            return this.errorBudgetBurn.shrink(this.alertShortWindowPerc)
        },

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
