import { config } from "../config.js"
import { percL10n } from "../lib/fmt.js"
import { clamp } from "../lib/math.js"
import { daysToSeconds } from "../lib/time.js"
import { inRange } from "../lib/validation.js"
import { ErrorBudget } from "./error-budget.js"
import { SLI } from "./sli.js"
import { TimeWindow } from "./time-window.js"

export class SLO {
    constructor(
        sli,
        perc = config.slo.default,
        windowDays = config.windowDays.default,
        lowerThreshold = config.lowerThreshold.default,
        upperThreshold = config.upperThreshold.default,
    ) {
        if (!(sli instanceof SLI)) {
            throw new TypeError(`SLO: sli must be an instance of SLI. Got ${ sli }`)
        }
        this.sli = sli
        if (!inRange(perc, 0, 100)) {
            throw new RangeError(`SLO: perc must be a number between 0 and 100. Got ${ perc }`)
        }
        this.perc = perc
        this.window = new TimeWindow(this, daysToSeconds(windowDays))
        if (!inRange(lowerThreshold, config.lowerThreshold.min, config.lowerThreshold.max)) {
            throw new RangeError(`SLO: lowerThreshold must be a number between ${ config.lowerThreshold.min } and ${ config.lowerThreshold.max }. Got ${ lowerThreshold }`)
        }
        this._lowerThreshold = lowerThreshold
        if (!inRange(upperThreshold, config.upperThreshold.min, config.upperThreshold.max)) {
            throw new RangeError(`SLO: upperThreshold must be a number between ${ config.upperThreshold.min } and ${ config.upperThreshold.max }. Got ${ upperThreshold }`)
        }
        this._upperThreshold = upperThreshold
        if (this.lowerThreshold > this.upperThreshold) {
            throw new RangeError(`SLO: lowerThreshold must be less than upperThreshold. Got lowerThreshold=${ lowerThreshold } and upperThreshold=${ upperThreshold }`)
        }
    }

    get percL10n() {
        return percL10n(this.perc)
    }

    set errorBudgetPerc(val) {
        this.perc = 100 - val
    }

    get errorBudgetPerc() {
        return 100 - this.perc
    }

    get errorBudgetPercL10n() {
        return percL10n(this.errorBudgetPerc)
    }

    get lowerThreshold() {
        console.log('getting lower threshold', this._lowerThreshold)
        return this._lowerThreshold
    }

    get lowerThresholdMin() {
        return config.lowerThreshold.min
    }

    get lowerThresholdMax() {
        return this.sli.isUpperBounded ? this.upperThreshold : config.lowerThreshold.max
    }

    set lowerThreshold(val) {
        console.log('setting lower threshold to', val)
        this._lowerThreshold = clamp(val, this.lowerThresholdMin, this.lowerThresholdMax)
    }

    get upperThreshold() {
        return this._upperThreshold
    }

    get upperThresholdMin() {
        return this.sli.isLowerBounded ? this.lowerThreshold : config.upperThreshold.min
    }

    get upperThresholdMax() {
        return config.upperThreshold.max
    }

    set upperThreshold(val) {
        this._upperThreshold = clamp(val, this.upperThresholdMin, this.upperThresholdMax)
    }

    toString() {
        return `${ percL10n(this.perc) } of ${ this.sli.good } over the last ${ this.window.humanSec }`
    }
}
