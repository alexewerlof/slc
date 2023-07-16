import { createApp, ref, reactive, computed, watch } from './vendor/vue@3.3.4_dist_vue.esm-browser.prod.js'
import HelpComponent from './components/help-component.js'
import { errorBudgetEvents, errorBudgetPerc, errorBudgetTime, percent, percentToRatio } from './sl-math.js'
import { examples } from './examples.js'
import { windowUnits, secondsToTimePeriod, humanSeconds, toFixed, findWindowUnitFromShortTitle, clamp } from './util.js'

const selectedExampleIndex = ref(0)

const sli = reactive({
    // whether the SLO is time-based or event-based
    isTimeBased: true,
    // definition of good events or good time slots
    good: '',
    // definition of valid events or valid time slots
    valid: '',
    // unit of valid events (only useful when isTimeBased is false)
    unit: '',
})

const sliCalc = computed(() => {
    let unitCaption = 'Events Unit'
    let unit = sli.unit
    let valid = sli.valid
    // The function for aggregating good or valid event count or time duration
    let func = 'count'

    if (sli.isTimeBased) {
        func = 'duration'
        unitCaption = 'Time Unit'
        unit = sli.unit || 'duration'
    }

    return {
        func,
        unitCaption,
        unit,
        valid,
    }
})

const slo = reactive({
    perc: 99,
    windowMult: 1,
    windowUnit: windowUnits[4],
})

const sloWindow = computed(() => {
    return slo.windowUnit.sec * slo.windowMult
})

const sloInt = computed({
    get() {
        return Math.floor(slo.perc)
    },
    set(newIntStr) {
        const newInt = Number(newIntStr)
        const sloFrac = slo.perc % 1
        slo.perc = toFixed(newInt + sloFrac)
    }
})

const sloFrac = computed({
    get() {
        return toFixed(slo.perc % 1)
    },
    set(newFracStr) {
        const newFrac = Number(newFracStr)
        const sloInt = Math.floor(slo.perc)
        slo.perc = toFixed(sloInt + newFrac)
    }
})

const errorBudgetValidExample = ref(1_000_000)

const errorBudget = computed(() => {
    const perc = toFixed(errorBudgetPerc(slo.perc))

    if (sli.isTimeBased) {
        const sec = errorBudgetTime(slo.perc, sloWindow.value)
        return {
            perc,
            sec,
        }
    }

    const events = errorBudgetEvents(slo.perc, errorBudgetValidExample.value)
    return {
        perc,
        events,
    }
})

const alert = reactive({
    burnRate: 1,
    windowPerc: 50,
    shortWindowVisible: false,
    shortWindowDivider: 12,
})

const alertCalc = computed(() => {
    const timeToExhaust = sloWindow.value / alert.burnRate
    const maxFraction = Math.ceil(100 / alert.burnRate)
    if (alert.windowPerc > maxFraction) {
        alert.windowPerc = maxFraction
    }
    const shortWindowPerc = toFixed(alert.windowPerc / alert.shortWindowDivider, 1)
    const longWindowTimeToExhaust = percent(alert.windowPerc, timeToExhaust)
    const shortWindowTimeToExhaust = longWindowTimeToExhaust / alert.shortWindowDivider

    return {
        timeToExhaust,
        maxFraction,
        longWindowTimeToExhaust,
        shortWindowTimeToExhaust,
        shortWindowPerc,
    }
})

const app = createApp({
    setup() {
        watch(selectedExampleIndex, (newVal) => {
            const example = examples[newVal]
            sli.isTimeBased = Boolean(example.sli.isTimeBased)
            sli.good = example.sli.good
            sli.valid = example.sli.valid
            sli.unit = example.sli.unit
            slo.perc = example.slo.perc
            if (Array.isArray(example.slo.window)) {
                const [ windowMult, windowShortTitle] = example.slo.window
                slo.windowMult = windowMult
                slo.windowUnit = findWindowUnitFromShortTitle(windowShortTitle)
            }
        }, { immediate: true })

        return {
            examples,
            selectedExampleIndex,
            sli,
            sliCalc,
            slo,
            sloInt,
            sloFrac,
            sloWindow,
            errorBudget,
            errorBudgetValidExample,
            windowUnits,
            secondsToTimePeriod,
            humanSeconds,
            percentToRatio,
            percent,
            alert,
            alertCalc,
        }
    },
    components: {
        HelpComponent,
    },
    methods: {
        changeSLO(amount) {
            slo.perc = toFixed(clamp(slo.perc + amount, 0, 99.999))
        }
    }
})

app.mount('#app')