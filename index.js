import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import { config } from './config.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import examples from './examples.js'
import { daysToSeconds, normalizeUnit } from './lib/time.js'
import { Window } from './lib/window.js'
import { currL10n, numL10n, percL10n } from './lib/fmt.js'
import { inRange, inRangePosInt, isNum, isStr } from './lib/validation.js'
import { trackEvent } from './lib/analytics.js'
import { urlToState } from './lib/share.js'
import { Budget } from './lib/budget.js'

const app = createApp({
    data() {
        let showCookiePopup = true

        try {
            if (localStorage.getItem('showCookiePopup') === 'false') {
                showCookiePopup = false
            }
        } catch (e) {
            // ignore
        }

        return {
            // Expose the config to the UI
            config,
            // All the examples from example.js
            examples,
            // The index of the currently selected example
            selectedExampleIndex: 0,
            // Show the short window alert
            shortWindowVisible: false,
            // Show the cookie popup (use localStorage to remember the user's choice)
            showCookiePopup,
            // The text shown in the toast notification
            toastCaption: '',
            // The title of the SLI
            title: config.title.default,
            // The description of the SLI
            description: config.description.default,
            // unit of SLI or number of seconds in a time slot
            unit: config.unit.default,
            // definition of good events or good time slots
            good: config.good.default,
            // definition of valid events or valid time slots
            valid: config.valid.default,
            // The SLO percentage. It is also read/written by the sloInt and sloFrac computed properties
            slo: config.slo.default,
            // The length of the SLO window in days
            windowDays: config.windowDays.default,
            // For event based error budgets, this number holds the total valid events so we can compute the ammount of allowed failures
            errorBudgetValidExample: config.errorBudgetValidExample.default,
            // The cost of a bad event
            badEventCost: config.badEventCost.default,
            // The unit of the bad event cost
            badEventCurrency: config.badEventCurrency.default,
            // Alert burn rate: the rate at which the error budget is consumed
            burnRate: config.burnRate.default,
            // Long window alert: percentage of the SLO window
            longWindowPerc: config.longWindowPerc.default,
            // Short window alert: the fraction of the long window
            shortWindowDivider: config.shortWindowDivider.default,
        }
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
        HelpComponent,
        BurnComponent,
    },
    methods: {
        percentToRatio(x) {
            return percentToRatio(x)
        },

        numL10n(x) {
            return numL10n(x)
        },

        percL10n(x) {
            return percL10n(x)
        },
        
        changeSLO(amount) {
            this.slo = toFixed(clamp(this.slo + amount, 0, config.slo.max))
        },
        
        loadState(newState) {
            try {
                if (isStr(newState.title)) {
                    this.title = newState.title
                }
            
                if (isStr(newState.description)) {
                    this.description = newState.description
                }
            
                // Unit is a bit special. It can be the event name or a time slot length in seconds
                if (isStr(newState.unit) || inRangePosInt(newState.unit, config.timeSlot.min, config.timeSlot.max)) {
                    this.unit = newState.unit
                }
            
                if (isStr(newState.good)) {
                    this.good = newState.good
                }
            
                if (isStr(newState.valid)) {
                    this.valid = newState.valid
                }
            
                if (inRange(newState.slo, config.slo.min, config.slo.max)) {
                    this.slo = newState.slo
                }
            
                if (inRangePosInt(newState.windowDays, config.windowDays.min, config.windowDays.max)) {
                    this.windowDays = newState.windowDays
                }
            
                if (inRangePosInt(newState.errorBudgetValidExample, config.errorBudgetValidExample.min, config.errorBudgetValidExample.max)) {
                    this.errorBudgetValidExample = newState.errorBudgetValidExample
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
        
        loadSelectedExample() {
            this.loadState(this.examples[this.selectedExampleIndex])
            this.toastCaption = `Loaded example`
        },
        
        hideCookiePopup() {
            this.showCookiePopup = false
            try {
                localStorage.setItem('showCookiePopup', 'false')
            } catch (e) {
                // ignore
            }
        },

        async copy(elementId, label) {
            try {
                var copyText = document.getElementById(elementId).innerText
                await navigator.clipboard.writeText(copyText)
                this.toastCaption = 'Copied to clipboard!'
                trackEvent('copy', 'button', label)
            } catch(err) {
                // ignore
            }
        },
    },
    computed: {
        sloWindow() {
            return new Window(
                daysToSeconds(this.windowDays),
                this.unit,
            )
        },

        // whether the SLI is time-based or event-based
        isTimeBased: {
            get() {
                return isNum(this.unit)
            },
            set(newVal) {
                this.unit = newVal ? 60 : 'events'
            }
        },

        sloInt: {
            get() {
                return Math.floor(this.slo)
            },
            set(newIntStr) {
                const newInt = Number(newIntStr)
                const sloFrac = this.slo % 1
                this.slo = toFixed(newInt + sloFrac)
            }
        },

        sloFrac: {
            get() {
                return toFixed(this.slo % 1)
            },
            set(newFracStr) {
                const newFrac = Number(newFracStr)
                const sloInt = Math.floor(this.slo)
                this.slo = toFixed(sloInt + newFrac)
            }
        },

        errorBudgetPerc() {
            return toFixed(100 - this.slo)
        },

        eventCount() {
            if (this.isTimeBased) {
                return this.sloWindow.timeSlotCount
            } else {
                return this.errorBudgetValidExample
            }
        },

        errorBudget() {
            const { sec, unit } = this.sloWindow
            const eventCount = Math.floor(percent(this.errorBudgetPerc, this.eventCount))
            const eventCost = this.badEventCost || 0
            return new Budget(sec, unit, eventCount, eventCost, this.badEventCurrency)
        },

        // Time to burn the entire error budget at the given burnRate
        errorBudgetBurn() {
            return this.errorBudget.shrinkWindow(100 / this.burnRate)
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
                const url = new URL(window.location.origin)

                // A few fields may be empty strings, so let's keep the URL short
                if (this.title) {
                    url.searchParams.set('title', this.title)
                }
                if (this.description) {
                    url.searchParams.set('description', this.description)
                }
                url.searchParams.set('unit', this.unit)
                url.searchParams.set('good', this.good)
                if (this.valid) {
                    url.searchParams.set('valid', this.valid)
                }
                url.searchParams.set('slo', this.slo)
                url.searchParams.set('windowDays', this.windowDays)
                url.searchParams.set('errorBudgetValidExample', this.errorBudgetValidExample)
                url.searchParams.set('badEventCost', this.badEventCost)
                url.searchParams.set('badEventCurrency', this.badEventCurrency)
                url.searchParams.set('burnRate', this.burnRate)
                url.searchParams.set('longWindowPerc', this.longWindowPerc)
                url.searchParams.set('shortWindowDivider', this.shortWindowDivider)
            
                return url.toString()
            } catch (e) {
                console.error('Could not create shareurl', e)
                return null
            }
        },
    }
})

app.mount('#app')