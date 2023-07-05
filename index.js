import { createApp, ref, reactive, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { examples } from './examples.js'
import { windowUnits, secondsToTimePeriod, toFixed } from './util.js'

const sli = reactive({
    isTimeBased: true,
    // aggregation period in seconds
    aggregationPeriod: 60,
    good: 'response_time < 500ms',
    valid: 'authenticated_requests',
    unit: 'requests',
})

const slo = reactive({
    perc: 99.5,
    windowMult: 1,
    windowUnit: windowUnits[4],
})

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
        const sloInt = Math.floor(slo.perc)
        const newFrac = Number(newFracStr)
        slo.perc = toFixed(sloInt + newFrac)
    }
})

const errorBudget = computed(() => {
    return {
        perc: toFixed(100 - slo.perc),
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
                return toFixed(ret, 3)
            } if (ret < 10) {
                return toFixed(ret, 1)
            }
            return Math.round(ret)
        })

        const downTime = computed(() => {
            return windowSec.value - upTime.value
        })

        const goodTarget = computed(() => {
            return Math.ceil(slo.perc * sliExample.valid / 100)
        })

        const totalTarget = computed(() => {
            return Math.ceil(sliExample.good * 100 / slo.perc)
        })

        const exampleTarget = computed(() => {
            return toFixed(sliExample.good * 100 / sliExample.valid, 3)
        })

        return {
            examples,
            sli,
            slo,
            sliExample,
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