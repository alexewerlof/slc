import { createApp, ref, reactive, computed, watch } from './vue@3.3.4_dist_vue.esm-browser.prod.js'
import { errorBudgetPerc, errorBudgetTime } from './sl-math.js'
import { examples } from './examples.js'
import { windowUnits, secondsToTimePeriod, toFixed, findWindowUnitFromShortTitle } from './util.js'

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

const slo = reactive({
    perc: 99,
    windowMult: 1,
    windowUnit: windowUnits[4],
})

const sloWindow = computed(() => {
    return slo.windowUnit.sec * slo.windowMult
})

// Only useful for event based SLIs
const sliExample = reactive({
    good: 9_999_850,
    valid: 10_000_000,
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

const errorBudget = computed(() => {
    const perc = toFixed(errorBudgetPerc(slo.perc))

    if (sli.isTimeBased) {
        const sec = errorBudgetTime(slo.perc, sloWindow.value)
        return {
            perc,
            desc: `${secondsToTimePeriod(sec)} (${sec} sec)`,
        }
    }

    return {
        perc,
        desc: `${Math.round(errorBudgetTime(slo.perc, sloWindow.value))} ${sli.unit}`,
    }
})

const app = createApp({
    setup() {
        const upTime = computed(() => {
            const ret = sloWindow.value * slo.perc / 100
            if (ret < 1) {
                return toFixed(ret, 3)
            } if (ret < 10) {
                return toFixed(ret, 1)
            }
            return Math.round(ret)
        })

        const ebPerc = computed(() => {
            return toFixed(errorBudgetPerc(slo.perc))
        })

        const goodTarget = computed(() => {
            return Math.ceil(slo.perc * sliExample.valid / 100)
        })

        const totalTarget = computed(() => {
            return Math.ceil(sliExample.good * 100 / slo.perc)
        })

        const exampleTarget = computed(() => {
            return toFixed(sliExample.good * 100 / sliExample.valid)
        })

        const selectedExampleIndex = ref(0)

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
            slo,
            sliExample,
            sloInt,
            sloFrac,
            errorBudget,
            upTime,
            ebPerc,
            windowUnits,
            sloWindow,
            secondsToTimePeriod,
            goodTarget,
            totalTarget,
            exampleTarget,
        }
    }
})

app.mount('#app')