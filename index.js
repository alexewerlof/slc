import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import { config } from './config.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import examples from './examples.js'
import { daysToSeconds, normalizeUnit } from './lib/time.js'
import { Window } from './lib/window.js'
import { defaultState, sanitizeState } from './lib/state.js'
import { numL10n, percL10n } from './lib/fmt.js'
import { isNum } from './lib/validation.js'
import { trackEvent } from './lib/analytics.js'
import { stateToUrl, urlToState } from './lib/share.js'

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

        let initialState = defaultState()
        try {
            initialState = sanitizeState(urlToState(window.location.href))
            this.toastCaption = 'Loaded state from URL'
        } catch (e) {
            // silently fail if the params cannot be loaded from the URL
            this.toastCaption = `Failed loading state from URL: ${e}`
            console.error('Failed loading state from URL:', e)
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
            // The part of the state which can be saved/loaded
            ...initialState,
        }
    },
    created() {
        try {
            const url = new URL(window.location.href)
            if (url.searchParams.has('state')) {
                this.loadState(decodeState(url.searchParams.get('state')))
                this.toastCaption = 'Loaded state from URL'
            }
        } catch (e) {
            // silently fail if the params cannot be loaded from the URL
            this.toastCaption = `Failed to load state from URL ${e}`
            console.error(e)
        }
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
        
        loadState(state) {
            try {
                const newState = sanitizeState(state)
                this.title = newState.title
                this.description = newState.description
                this.unit = newState.unit
                this.good = newState.good
                this.valid = newState.valid
                this.slo = newState.slo
                this.windowDays = newState.windowDays
                // TODO: Rename this variable to something shorter and more sensible
                this.errorBudgetValidExample = newState.errorBudgetValidExample
                this.burnRate = newState.burnRate
                this.longWindowPerc = newState.longWindowPerc
                this.shortWindowDivider = newState.shortWindowDivider
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
        stateObject() {
            return {
                title: this.title,
                description: this.description,
                unit: this.unit,
                good: this.good,
                valid: this.valid,
                slo: this.slo,
                windowDays: this.windowDays,
                errorBudgetValidExample: this.errorBudgetValidExample,
                burnRate: this.burnRate,
                longWindowPerc: this.longWindowPerc,
                shortWindowDivider: this.shortWindowDivider,
            }
        },

        // Returns the normalized unit of SLI for the UI to read better
        normalizedUnit() {
            return normalizeUnit(this.unit)
        },

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

        errorBudgetWindow() {
            if (!this.isTimeBased) {
                return null
            }

            return this.sloWindow.newFractionalWindow(this.errorBudgetPerc)
        },

        errorBudgetBurnPerc() {
            return 100 / this.burnRate
        },

        // Based on the given burn rate
        errorBudgetTimeToExhaust() {
            return this.sloWindow.newFractionalWindow(this.errorBudgetBurnPerc)
        },

        // Number of bad events allowed for the given value of valid in errorBudgetValidExample
        errorBudgetBadExample() {
            return numL10n(Math.floor(percent(this.errorBudgetPerc, this.errorBudgetValidExample || 1)))
        },

        alertLongWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(this.longWindowPerc)
        },

        alertTTRWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(100 - this.longWindowPerc)
        },

        alertLongWindowConsumedTimeSlots() {
            return this.errorBudgetWindow.newFractionalWindow(this.longWindowPerc).timeSlotsFloor
        },

        // As a percentage of the error budget
        alertShortWindowPerc() {
            return toFixed(this.longWindowPerc / this.shortWindowDivider)
        },

        alertShortWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(this.alertShortWindowPerc)
        },

        alertShortWindowConsumedTimeSlots() {
            return this.errorBudgetWindow.newFractionalWindow(this.alertShortWindowPerc).timeSlotsFloor
        },

        shareUrl() {
            try {
                return stateToUrl(window.location.origin, this.stateObject)
            } catch (e) {
                console.error(e)
                return null
            }
        },
    }
})

app.mount('#app')