import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import sliExamples from './examples.js'
import { daysToSeconds } from './lib/time.js'
import { Window } from './lib/window.js'
import { paramToUrl, paramsFromUrl, validateParams } from './lib/validation.js'
import { numL10n, percL10n } from './lib/fmt.js'

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
            // All the examples from example.js
            examples: sliExamples,
            // The index of the currently selected example
            selectedExampleIndex: 2,
            //TODO: if the timeSlot is larger than alerting windows, we should show a warning
            // The title of the SLI
            title: '',
            // The description of the SLI
            description: '',
            // definition of good events or good time slots
            good: '',
            // definition of valid events or valid time slots
            valid: '',
            // unit of SLI
            unit: '',
            // For time-based SLIs, this is the number of seconds in a time slot
            timeSlot: 0,
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
            // Show the short window alert
            shortWindowVisible: false,
            // Show the cookie popup (use localStorage to remember the user's choice)
            showCookiePopup,
        }
    },
    created() {
        try {
            this.loadParams(paramsFromUrl(window.location.href))
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
            this.slo = toFixed(clamp(this.slo + amount, 0, 99.999))
        },
        
        loadParams(params) {
            const { title, description, unit, good, valid, timeSlot } = validateParams(params)
            this.title = title
            this.description = description
            this.good = good
            this.unit = unit
            this.timeSlot = timeSlot
            this.valid = valid
        },
        
        loadExample(example) {
            this.loadParams(example)
        },
        
        hideCookiePopup() {
            this.showCookiePopup = false
            try {
                localStorage.setItem('showCookiePopup', 'false')
            } catch (e) {
                // ignore
            }
        },
    },
    computed: {
        // Returns the unit of SLI for the UI to read better
        sliUnit() {
            return this.isTimeBased ? 'Time Slots' : this.unit
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
            return paramToUrl(window.location.origin, {
                title: this.title,
                description: this.description,
                unit: this.unit,
                good: this.good,
                valid: this.valid,
                timeSlot: this.timeSlot,
            })
        },
    }
})

app.mount('#app')