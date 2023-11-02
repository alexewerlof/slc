import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import { config } from './config.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import examples from './examples.js'
import { daysToSeconds } from './lib/time.js'
import { Window } from './lib/window.js'
import { defaultState, decodeState, encodeState, sanitizeState } from './lib/sharing.js'
import { numL10n, percL10n, strFallback } from './lib/fmt.js'

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
            const url = new URL(window.location.href)
            if (url.searchParams.has('state')) {
                initialState = sanitizeState(decodeState(url.searchParams.get('state')))
                this.toastCaption = 'Loaded state from URL'
            } else if (localStorage.getItem('state')) {
                initialState = sanitizeState(JSON.parse(localStorage.getItem('state')))
                this.toastCaption = 'Loaded state from local storage'
            }
        } catch (e) {
            // silently fail if the params cannot be loaded from the URL
            this.toastCaption = `${e}`
        }

        return {
            // Expose the config to the UI
            config,
            // All the examples from example.js
            examples,
            // The index of the currently selected example
            selectedExampleIndex: 2,
            // Show the short window alert
            shortWindowVisible: false,
            // Show the cookie popup (use localStorage to remember the user's choice)
            showCookiePopup,
            // The text shown in the toast notification
            toastCaption: '',
            //TODO: if the timeSlot is larger than alerting windows, we should show a warning
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
            const newState = sanitizeState(state)
            this.title = newState.title
            this.description = newState.description
            this.unit = newState.unit
            this.timeSlot = newState.timeSlot
            this.good = newState.good
            this.valid = newState.valid
            this.slo = newState.slo
            this.windowDays = newState.windowDays
            this.errorBudgetValidExample = newState.errorBudgetValidExample
            this.burnRate = newState.burnRate
            this.longWindowPerc = newState.longWindowPerc
            this.shortWindowDivider = newState.shortWindowDivider
        },
        
        loadSelectedExample() {
            this.loadState(this.examples[this.selectedExampleIndex])
        },
        
        hideCookiePopup() {
            this.showCookiePopup = false
            try {
                localStorage.setItem('showCookiePopup', 'false')
            } catch (e) {
                // ignore
            }
        },

        toastAnimationEnded() {
            // TODO: remove this method
            this.toastCaption = ''
            console.log('animation end')
        },

        async copy(elementId) {
            try {
                var copyText = document.getElementById(elementId).innerText
                await navigator.clipboard.writeText(copyText)
                this.toastCaption = 'Copied to clipboard!'
            } catch(err) {
            }
        },
    },
    watch: {
        stateObject: {
            handler(newState) {
                try {
                    localStorage.setItem('state', JSON.stringify(newState))
                } catch (e) {
                    // ignore
                }
            },
            deep: true,
        },
    },
    computed: {
        stateObject() {
            return {
                title: this.title,
                description: this.description,
                unit: this.unit,
                timeSlot: this.timeSlot,
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
            return this.isTimeBased ? 'Time Slots' : strFallback(this.unit, 'events')
        },

        sloWindow() {
            return new Window(
                daysToSeconds(this.windowDays),
                this.timeSlot,
            )
        },

        // whether the SLI is time-based or event-based
        isTimeBased: {
            get() {
                return this.timeSlot > 0
            },
            set(newVal) {
                this.timeSlot = newVal ? 60 : 0
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
            return Math.floor(percent(this.longWindowPerc, this.errorBudgetWindow.timeSlots))
        },

        // As a percentage of the error budget
        alertShortWindowPerc() {
            return toFixed(this.longWindowPerc / this.shortWindowDivider)
        },

        alertShortWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(this.alertShortWindowPerc)
        },

        alertShortWindowConsumedTimeSlots() {
            return Math.floor(percent(this.alertShortWindowPerc, this.errorBudgetWindow.timeSlots))
        },

        shareUrl() {
            try {
                const url = new URL(origin)
                url.searchParams.set('state', encodeState(this.stateObject()))
                return url.toString()
            } catch (e) {
                return null
            }
        },
    }
})

app.mount('#app')