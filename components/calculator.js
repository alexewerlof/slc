import { Indicator } from './indicator.js'
import { isDef, isObj } from '../lib/validation.js'
import { urlToState } from '../lib/share.js'
import { SelectableArray } from '../lib/selectable-array.js'

export class Calculator {
    /** @type {Indicator[]} List of indicators managed by this calculator */
    indicators = new SelectableArray(Indicator)

    constructor(options) {
        if (!options) {
            return
        }

        this.state = options
    }

    get state() {
        return { indicators: this.indicators.map((indicator) => indicator.state) }
    }

    set state(options) {
        if (!isObj(options)) {
            throw new TypeError(`Invalid options: ${options} (${typeof options})`)
        }

        if (isDef(options.indicators)) {
            this.indicators.state = options.indicators
        }
    }
}

export function makeCalculator(urlStr) {
    const url = new URL(urlStr)
    if (url.searchParams.has('urlVer') || url.searchParams.has('target')) {
        try {
            return new Calculator(urlToState(url).state)
        } catch (e) {
            console.warn('Using default because failed to load from URL:', e)
        }
    }
    return new Calculator({
        indicators: [{
            displayName: 'Latency: Response Latency',
            metricName: 'response_latency',
            metricUnit: 'ms',
            expectedDailyEvents: 10000,
            upperBound: 'le',
            timeslice: 60,
            objectives: [{
                target: 99,
                windowDays: 30,
                upperThreshold: 2000,
                alerts: [{
                    burnRate: 10,
                    longWindowPerc: 8,
                }],
            }],
        }],
    })
}
