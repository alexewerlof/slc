import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import sliExamples from './examples.js'
import { daysToSeconds } from './lib/time.js'
import { Window } from './lib/window.js'
import { validateParams } from './lib/validation.js'


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
            //TODO: if the sli.timeSlot is larger than alerting windows, we should show a warning
            sli: {
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
            },
            slo: {
                // This percentage is also read/written by the sloInt and sloFrac computed properties
                perc: 99,
                // The length of the window in days
                windowDays: 30,
            },
            // For event based error budgets, this number holds the total valid events so we can compute the ammount of allowed failures
            errorBudgetValidExample: 1_000_000,
            alert: {
                burnRate: 6,
                longWindowPerc: 5,
                shortWindowVisible: false,
                shortWindowDivider: 12,
            },
            showCookiePopup,
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
        changeSLO(amount) {
            this.slo.perc = toFixed(clamp(this.slo.perc + amount, 0, 99.999))
        },
        loadParams(params) {
            const { title, description, unit, good, valid, timeSlot } = validateParams(params)
            this.sli.title = title
            this.sli.description = description
            this.sli.good = good
            this.sli.unit = unit
            this.sli.timeSlot = timeSlot
            this.sli.valid = valid
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
            return this.isTimeBased ? 'Time Slots' : this.sli.unit
        },

        sloWindow() {
            return new Window(
                daysToSeconds(this.slo.windowDays),
                this.sli.timeSlot,
            )
        },

        // whether the SLI is time-based or event-based
        isTimeBased: {
            get() {
                return this.sli.timeSlot > 0
            },
            set(newVal) {
                this.sli.timeSlot = newVal ? 60 : 0
            }
        },

        sloInt: {
            get() {
                return Math.floor(this.slo.perc)
            },
            set(newIntStr) {
                const newInt = Number(newIntStr)
                const sloFrac = this.slo.perc % 1
                this.slo.perc = toFixed(newInt + sloFrac)
            }
        },

        sloFrac: {
            get() {
                return toFixed(this.slo.perc % 1)
            },
            set(newFracStr) {
                const newFrac = Number(newFracStr)
                const sloInt = Math.floor(this.slo.perc)
                this.slo.perc = toFixed(sloInt + newFrac)
            }
        },

        errorBudgetPerc() {
            return toFixed(100 - this.slo.perc)
        },

        errorBudgetWindow() {
            if (!this.isTimeBased) {
                return null
            }

            return this.sloWindow.newFractionalWindow(this.errorBudgetPerc)
        },

        errorBudgetBurnPerc() {
            return 100 / this.alert.burnRate
        },

        // Based on the given burn rate
        errorBudgetTimeToExhaust() {
            return this.sloWindow.newFractionalWindow(this.errorBudgetBurnPerc)
        },

        // Number of bad events allowed for the given value of valid in errorBudgetValidExample
        errorBudgetBadExample() {
            return Math.floor(percent(this.errorBudgetPerc, this.errorBudgetValidExample || 1))
        },

        alertLongWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(this.alert.longWindowPerc)
        },

        alertTTRWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(100 - this.alert.longWindowPerc)
        },

        alertLongWindowConsumedTimeSlots() {
            return Math.floor(percent(this.alert.longWindowPerc, this.errorBudgetWindow.timeSlots))
        },

        // As a percentage of the error budget
        alertShortWindowPerc() {
            return toFixed(this.alert.longWindowPerc / this.alert.shortWindowDivider)
        },

        alertShortWindow() {
            return this.errorBudgetTimeToExhaust.newFractionalWindow(this.alertShortWindowPerc)
        },

        alertShortWindowConsumedTimeSlots() {
            return Math.floor(percent(this.alertShortWindowPerc, this.errorBudgetWindow.timeSlots))
        },
    }
})

app.mount('#app')