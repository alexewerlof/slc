import { createApp } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import HelpComponent from './components/help-component.js'
import BurnComponent from './components/burn-component.js'
import { percent, percentToRatio, toFixed, clamp } from './lib/math.js'
import sliExamples from './sli-examples.js'
import { windowUnits } from './lib/time.js'
import { Window } from './lib/window.js'


const app = createApp({
    data() {
        return {
            // All the examples from example.js
            examples: sliExamples,
            // The index of the currently selected example
            selectedExampleIndex: 2,
            //TODO: if the sli.timeSlot is larger than alerting windows, we should show a warning
            sli: {
                // whether the SLI is time-based or event-based
                isTimeBased: false,
                // For time-based SLIs, this is the number of seconds in a time slot
                timeSlot: 0,
                // definition of good events or good time slots
                good: '',
                // definition of valid events or valid time slots
                valid: '',
                // unit of valid events (only used when isTimeBased is false)
                unit: '',
            },
            slo: {
                // This percentage is also read/written by the sloInt and sloFrac computed properties
                perc: 99,
                // The window multiplier. The window length as given by sloWindow is the result of windowMult * windowUnit.sec
                windowMult: 1,
                windowUnit: windowUnits[4],
            },
            // For event based error budgets, this number holds the total valid events so we can compute the ammount of allowed failures
            errorBudgetValidExample: 1_000_000,
            alert: {
                burnRate: 6,
                longWindowPerc: 5,
                shortWindowVisible: false,
                shortWindowDivider: 12,
            },
            windowUnits,
            percentToRatio,
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
        changeSLO(amount) {
            this.slo.perc = toFixed(clamp(this.slo.perc + amount, 0, 99.999))
        },
        loadExample(example) {
            this.sli.title = example.title
            this.sli.description = example.description
            this.sli.good = example.good
            this.sli.isTimeBased = Boolean(example.isTimeBased)
            if (this.sli.isTimeBased) {
                this.sli.unit = ''
                this.sli.timeSlot = example.timeSlot
                this.sli.valid = ''
            } else {
                this.sli.unit = example.unit
                this.sli.timeSlot = 60
                this.sli.valid = example.valid
            }
        },
    },
    computed: {
        // Returns the unit of SLI for the UI to read better
        sliUnit() {
            return this.sli.isTimeBased ? 'Time Slots' : this.sli.unit
        },

        sloWindow() {
            return new Window(
                this.slo.windowMult * this.slo.windowUnit.sec,
                this.sli.isTimeBased ? this.sli.timeSlot : 0,
            )
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
            if (!this.sli.isTimeBased) {
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