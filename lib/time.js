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

export function findWindowUnitFromShortTitle(windowShortTitle) {
    return windowUnits.find(({ shortTitle }) => shortTitle === windowShortTitle)
}

// Parses a string like '1M' to an array like [1, REF_TO_MONTH_OBJ_IN_windowUnits]
export function parseWindow(windowStr) {
    const match = windowStr.match(/^(\d+)([a-zA-Z]+)$/)

    if (!match) {
        throw new Error(`Could not parse '${windowStr}' as a time window.`)
    }

    const [, nStr, unitStr] = match

    const windowUnit = findWindowUnitFromShortTitle(unitStr)
    if (!windowUnit) {
        throw new Error(`Invalid unit '${unitStr}' in '${windowStr}'`)
    }
    const windowMult = Number(nStr)
    if (windowMult > windowUnit.max) {
        throw new Error(`Invalid window '${windowStr}'. ${windowUnit.title} cannot be larger than ${windowUnit.max}. Got ${windowMult}`)
    }

    return [windowMult, windowUnit]
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
