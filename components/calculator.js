import { Indicator } from './indicator.js'
import { rmItemGetNext } from '../lib/math.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { urlToState } from '../lib/share.js'

export class Calculator {
    /** @type {Indicator[]} List of indicators managed by this calculator */
    indicators = []
    /** @type {Indicator|undefined} the selected indicator in UI */
    selIndicator = undefined

    constructor(options) {
        if (!options) {
            return
        }

        if (!isObj(options)) {
            throw new TypeError(`Invalid options: ${options} (${typeof options})`)
        }

        const {
            indicators,
        } = options

        if (isDef(indicators)) {
            if (!isArr(indicators)) {
                throw new TypeError(`Invalid indicators: ${indicators} (${typeof indicators})`)
            }
            for (const indicatorOptions of indicators) {
                this.addIndicator(new Indicator(indicatorOptions))
            }
            if (this.indicators.length) {
                this.selIndicator = this.indicators[0]
            }
        }
    }

    addIndicator(indicator) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
        }
        this.indicators.push(indicator)
        this.selIndicator = indicator
        return indicator
    }

    addNewIndicator() {
        return this.addIndicator(new Indicator())
    }

    removeIndicator(indicator) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
        }
        if (!this.indicators.includes(indicator)) {
            throw new Error(`Indicator does not belong to this calculator: ${indicator}`)
        }
        this.selIndicator = rmItemGetNext(this.indicators, this.selIndicator)
    }

    removeSelectedIndicator() {
        return this.removeIndicator(this.selIndicator)
    }

    save() {
        // Save the calculator to a file
        return { indicators: this.indicators.map((indicator) => indicator.save()) }
    }
}

export function makeCalculator(urlStr, fallbackState) {
    try {
        const url = new URL(urlStr)
        if (!url.searchParams.has('urlVer') || !url.searchParams.has('target')) {
            throw new Error('No state found in URL')
        }
        return new Calculator(urlToState(url).state)
    } catch (e) {
        console.info('Using fallback state because of failure to load it from URL:', e)
        return new Calculator(fallbackState)
    }
}
