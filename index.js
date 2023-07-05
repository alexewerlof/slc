import { createApp, ref, reactive, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { examples } from './examples.js'
import { windowUnits, secondsToTimePeriod } from './util.js'

const sli = reactive({
    isTimeBased: true,
    // aggregation period in seconds
    aggregationPeriod: 60,
    good: 'response_time < 500ms',
    goodExample: 9_999_850,
    valid: 'authenticated_requests',
    validExample: 10_000_000,
    eventUnit: 'requests',
})

const slo = reactive({
    perc: 99.5,
    precision: 3,
    windowMult: 1,
    windowUnit: windowUnits[4],
})

const sloInt = computed({
    get() {
        return Math.floor(slo.perc)
    },
    set(newIntStr) {
        const newInt = Number(newIntStr)
        const sloFrac = slo.perc % 1
        slo.perc = Number((newInt + sloFrac).toFixed(slo.precision))
    }
})

const sloFrac = computed({
    get() {
        return (slo.perc % 1).toFixed(slo.precision)
    },
    set(newFracStr) {
        const sloInt = Math.floor(slo.perc)
        const newFrac = Number(newFracStr)
        slo.perc = Number((sloInt + newFrac).toFixed(slo.precision))
    }
})

const errorBudget = computed(() => {
    return {
        perc: Number((100 - slo.perc).toFixed(slo.precision)),
    }
})

const app = createApp({
    setup() {
        const windowSec = computed(() => {
            return slo.windowUnit.sec * slo.windowMult
        })

        const upTime = computed(() => {
            const ret = windowSec.value * slo.perc / 100
            if (ret < 1) {
                return Number(ret.toFixed(3))
            } if (ret < 10) {
                return Number(ret.toFixed(1))
            }
            return Math.round(ret)
        })

        const downTime = computed(() => {
            return windowSec.value - upTime.value
        })

        const goodTarget = computed(() => {
            return Math.ceil(slo.perc * sli.validExample / 100)
        })
        
        const totalTarget = computed(() => {
            return Math.ceil(sli.goodExample * 100 / slo.perc)
        })
        
        const exampleTarget = computed(() => {
            return (sli.goodExample * 100 / sli.validExample).toFixed(3)
        })

        return {
            examples,
            sli,
            slo,
            sloInt,
            sloFrac,
            errorBudget,
            upTime,
            downTime,
            windowUnits,
            windowSec,
            secondsToTimePeriod,
            goodTarget,
            totalTarget,
            exampleTarget,
        }
    }
})

app.mount('#app')