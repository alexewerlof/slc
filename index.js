import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import { config } from './config.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import sliExamples from './examples.js'
import { daysToSeconds } from './lib/time.js'
import { Window } from './lib/window.js'
import { isBetween, isStr } from './lib/validation.js'
import { decodeState, encodeState } from './lib/sharing.js'
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

        return {
            // Expose the config to the UI
            config,
            // All the examples from example.js
            examples: sliExamples,
            // The index of the currently selected example
            selectedExampleIndex: 2,
            // Show the short window alert
            shortWindowVisible: false,
            // Show the cookie popup (use localStorage to remember the user's choice)
            showCookiePopup,
            // The text shown in the toast notification
            toastCaption: '',
            //TODO: if the timeSlot is larger than alerting windows, we should show a warning
            // The title of the SLI
            title: '',
            // The description of the SLI
            description: '',
            // unit of SLI
            unit: '',
            // For time-based SLIs, this is the number of seconds in a time slot
            timeSlot: 0,
            // definition of good events or good time slots
            good: '',
            // definition of valid events or valid time slots
            valid: '',
            // The SLO percentage. It is also read/written by the sloInt and sloFrac computed properties
            slo: 99,
            // The length of the SLO window in days
            windowDays: 30,
            // For event based error budgets, this number holds the total valid events so we can compute the ammount of allowed failures
            errorBudgetValidExample: 1_000_000,
            // Alert burn rate: the rate at which the error budget is consumed
            burnRate: 6,
            // Long window alert: percentage of the SLO window
            longWindowPerc: 5,
            // Short window alert: the fraction of the long window
            shortWindowDivider: 12,
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
            this.loadExample(this.examples[this.selectedExampleIndex])
        }
    },
    watch: {
        selectedExampleIndex: {
            handler(newVal) {
                this.loadExample(this.examples[newVal])
            },
            immediate: true
        },
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
            if (isStr(state.title)) {
                this.title = state.title
            }
            if (isStr(state.description)) {
                this.description = state.description
            }
            if (isStr(state.unit)) {
                this.unit = state.unit
            }
            // TODO: read the 3600 from a config and use it in index.html as well
            if (Number.isInteger(state.timeSlot) && isBetween(state.timeSlot, config.timeSlot.min, state.timeSlot <= config.timeSlot.max)) {
                this.timeSlot = state.timeSlot
            }
            if (isStr(state.good)) {
                this.good = state.good
            }
            if (isStr(state.valid)) {
                this.valid = state.valid
            }
            if (isBetween(state.slo, config.slo.min, config.slo.max)) {
                this.slo = state.slo
            }
            if (Number.isInteger(state.windowDays) && isBetween(state.windowDays, config.windowDays.min, config.windowDays.max)) {
                this.windowDays = state.windowDays
            }
            if (Number.isInteger(state.errorBudgetValidExample) && isBetween(state.errorBudgetValidExample, config.errorBudgetValidExample.min, config.errorBudgetValidExample.max)) {
                this.errorBudgetValidExample = state.errorBudgetValidExample
            }
            if (isBetween(state.burnRate, config.burnRate.min, config.burnRate.max)) {
                this.burnRate = state.burnRate
            }
            if (isBetween(state.longWindowPerc, config.longWindowPerc.min, config.longWindowPerc.max)) {
                this.longWindowPerc = state.longWindowPerc
            }
            if (isBetween(state.shortWindowDivider, config.shortWindowDivider.min, config.shortWindowDivider.max)) {
                this.shortWindowDivider = state.shortWindowDivider
            }
        },

        saveState() {
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
        
        loadExample(example) {
            this.loadState(example)
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
    computed: {
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
                url.searchParams.set('state', encodeState(this.saveState()))
                return url.toString()
            } catch (e) {
                return null
            }
        },
    }
})

app.mount('#app')