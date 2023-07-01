import { createApp, ref, reactive, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


// For a given window unit, what would be the max?
// The title should be something Intl.RelativeTimeFormat can handle
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format
const windowUnits = [
    {
        title: 'minute',
        sec: 1 * 60,
        max: 60,
    },
    {
        title: 'hour',
        sec: 1 * 60 * 60,
        max: 24,
    },
    {
        title: 'day',
        sec: 24 * 60 * 60,
        max: 30,
    },
    {
        title: 'week',
        sec: 7 * 24 * 60 * 60,
        max: 4,
    },
    {
        title: 'month',
        sec: 30 * 24 * 60 * 60,
        max: 12,
    },
    /*
    {
        title: 'quarter',
        sec: 90 * 24 * 60 * 60,
        max: 4,
    },
    */
    {
        title: 'year',
        sec: 365 * 24 * 60 * 60,
        max: 5,
    },
]

const sli = reactive({
    isTimeBased: true,
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

function secondsToTimePeriod(seconds) {
    let result = []

    const addToResult = (val, title) => result.push(`${val} ${title}${val > 1 ? 's' : ''}`)

    for (let i = windowUnits.length - 1; i >= 0; i--) {
        const period = windowUnits[i]
        const periodValue = Math.floor(seconds / period.sec)

        if (periodValue > 0) {
            addToResult(periodValue, period.title)
            seconds -= periodValue * period.sec
        }
    }

    if (seconds >= 1) {
        addToResult(Math.round(seconds), 'second')
    } else if (seconds > 0) {
        addToResult(Math.round(seconds * 1000), 'millisecond')
    }

    return result.join(', ')
}

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