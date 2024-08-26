import { config } from "../config.js"
import { percL10n } from "../lib/fmt.js"
import { clamp } from "../lib/math.js"
import { daysToSeconds } from "../lib/time.js"
import { inRange } from "../lib/validation.js"
import { badFormula, goodFormula } from "./condition.js"
import { ErrorBudget } from "./error-budget.js"
import { SLI } from "./sli.js"
import { Thresholds } from "./thresholds.js"
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
        this.thresholds = new Thresholds(this, lowerThreshold, upperThreshold)
    }

    get good() {
        return goodFormula(this.sli, this.thresholds)
    }

    get bad() {
        return badFormula(this.sli, this.thresholds)
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

    toString() {
        const ret = []
        ret.push('Percentage of')
        ret.push(this.sli.good)
        ret.push('over the last')
        ret.push(this.window.humanSec)
        ret.push('>=')
        ret.push(percL10n(this.perc))
        return ret.join(' ')
    }
}
