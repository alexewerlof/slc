import { toFixed } from "./math.js"

// Short title matches OpenSLO spec: https://github.com/openslo/openslo#duration-shorthand
export const windowUnits = [
    {
        title: 'minute',
        shortTitle: 'm',
        sec: 1 * 60,
        max: 60,
    },
    {
        title: 'hour',
        shortTitle: 'h',
        sec: 1 * 60 * 60,
        max: 24,
    },
    {
        title: 'day',
        shortTitle: 'd',
        sec: 24 * 60 * 60,
        max: 30,
    },
    {
        title: 'week',
        shortTitle: 'w',
        sec: 7 * 24 * 60 * 60,
        max: 4,
    },
    {
        title: 'month',
        shortTitle: 'M',
        sec: 30 * 24 * 60 * 60,
        max: 12,
    },
    /*
    {
        title: 'quarter',
        shortTitle: 'Q',
        sec: 90 * 24 * 60 * 60,
        max: 4,
    },
    */
    {
        title: 'year',
        shortTitle: 'Y',
        sec: 365 * 24 * 60 * 60,
        max: 5,
    },
]

export function daysToSeconds(days) {
    return days * 24 * 60 * 60
}

export function humanTime(seconds, useShortTitle = false) {
    let result = []

    function addToResult(val, { title, shortTitle }) {
        if (useShortTitle) {
            result.push(`${val}${shortTitle}`)
        } else {
            result.push(`${val} ${title}${val > 1 ? 's' : ''}`)
        }
    }

    for (let i = windowUnits.length - 1; i >= 0; i--) {
        const period = windowUnits[i]
        const periodValue = Math.floor(seconds / period.sec)

        if (periodValue > 0) {
            addToResult(periodValue, period)
            seconds -= periodValue * period.sec
        }
    }

    if (seconds >= 1) {
        addToResult(Math.round(seconds), { title: 'second', shortTitle: 's' })
    } else if (seconds > 0) {
        addToResult(Math.round(seconds * 1000), { title: 'millisecond', shortTitle: 'ms' })
    }

    return result.join(', ')
}

export function humanSec(seconds) {
    let sec = seconds
    if (seconds >= 10) {
        sec = Math.round(seconds)
    } else if (seconds >= 1) {
        sec = toFixed(seconds, 1)
    } else {
        sec = toFixed(seconds, 3)
    }

    return `${sec} sec`
}
