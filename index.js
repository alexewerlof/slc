import { createApp, ref, reactive, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'


// For a given window unit, what would be the max?
// The title should be something Intl.RelativeTimeFormat can handle
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format
const windowUnits = [
    {
        title: 'minute',
        sec: 1 * 60,
        max: 24,
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

const slo = reactive({
    int: 99,
    frac: 999,
    fracMax: 999,
    windowMult: 1,
    windowUnit: windowUnits[4],
})

const sli = reactive({
    good: 'response_time < 500ms',
    goodExample: 9_999_850,
    valid: 'total_requests',
    validExample: 10_000_000,
    eventUnit: 'requests',
})

function secondsToTimePeriod(seconds) {
    let result = []

    const addToResult = (val, title) => result.push(`${val} ${title}${val > 1 ? 's' : ''} `)

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

const app = createApp({
    setup() {
        const sloVal = computed(() => {
            let ret = Number(slo.int)
            if ( slo.int < 100) {
                ret += slo.frac / (slo.fracMax + 1)
            }
            return ret
        })

        const windowSec = computed(() => {
            return slo.windowUnit.sec * slo.windowMult
        })

        const upTime = computed(() => {
            return windowSec.value * sloVal.value / 100
        })

        const downTime = computed(() => {
            return windowSec.value - upTime.value
        })

        const goodTarget = computed(() => {
            return Math.ceil(sloVal.value * sli.validExample / 100)
        })
        
        const totalTarget = computed(() => {
            return Math.ceil(sli.goodExample * 100 / sloVal.value)
        })
        
        const exampleTarget = computed(() => {
            return (sli.goodExample * 100 / sli.validExample).toFixed(3)
        })

        return {
            slo,
            sli,
            sloVal,
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