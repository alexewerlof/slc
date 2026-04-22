import { Indicator } from './indicator.js'
import { isDef, isObj } from '../lib/validation.js'
import { urlToState } from '../lib/share.js'
import { SelectableArray } from '../lib/selectable-array.js'

/**
 * Manages a list of Indicators for the standalone SLO calculator.
 */
export class Calculator {
    /** @type {Indicator[]} List of indicators managed by this calculator */
    indicators = new SelectableArray(Indicator)

    /**
     * Creates a new Calculator instance.
     * @param {Object} [state] Optional serialised state to restore.
     */
    constructor(state) {
        if (!state) {
            return
        }

        this.state = state
    }

    /**
     * Returns the serialisable state of this Calculator.
     * @returns {{indicators: Object[]}}
     */
    get state() {
        return { indicators: this.indicators.map((indicator) => indicator.state) }
    }

    /**
     * Restores the Calculator from a serialised state object.
     * @param {Object} newState
     */
    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`Invalid options: ${newState} (${typeof newState})`)
        }

        if (isDef(newState.indicators)) {
            this.indicators.state = newState.indicators
        }
    }
}

/**
 * Creates a Calculator from a URL string, falling back to a default example when the URL has no valid state.
 * @param {string} urlStr The full URL string to parse.
 * @returns {Calculator}
 */
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
        indicators: [
            {
                displayName: 'Latency: Response Latency',
                metricName: 'response_latency',
                metricUnit: 'ms',
                expectedDailyEvents: 10000,
                upperBound: 'le',
                timeslice: 60,
                objectives: [
                    {
                        target: 99,
                        windowDays: 30,
                        upperThreshold: 2000,
                        alerts: [
                            {
                                burnRate: 10,
                                longWindowPerc: 8,
                            },
                        ],
                    },
                ],
            },
        ],
    })
}
