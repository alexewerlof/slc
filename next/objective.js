import { config } from "../config.js"
import { percL10n } from "../lib/fmt.js"
import { daysToSeconds } from "../lib/time.js"
import { inRange } from "../lib/validation.js"
import { Alert } from "./alert.js"
import { badFormula, goodFormula } from "./bound.js"
import { Indicator } from "./indicator.js"
import { Thresholds } from "./thresholds.js"
import { TimeWindow } from "./time-window.js"

export class Objective {
    constructor(
        indicator,
        perc = config.slo.default,
        windowDays = config.windowDays.default,
        lowerThreshold = config.lowerThreshold.default,
        upperThreshold = config.upperThreshold.default,
    ) {
        if (!(indicator instanceof Indicator)) {
            throw new TypeError(`Objective: sli must be an instance of Indicator. Got ${ indicator }`)
        }
        this.indicator = indicator
        if (!inRange(perc, 0, 100)) {
            throw new RangeError(`Objective: perc must be a number between 0 and 100. Got ${ perc }`)
        }
        this.perc = perc
        this.window = new TimeWindow(this, windowDays)
        this.thresholds = new Thresholds(this, lowerThreshold, upperThreshold)
        this.alerts = []
    }

    get good() {
        return goodFormula(this.indicator, this.thresholds)
    }

    get bad() {
        return badFormula(this.indicator, this.thresholds)
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

    addNewAlert() {
        this.alerts.push(new Alert(this))
    }

    toString() {
        const ret = []
        ret.push('Percentage of')
        ret.push(this.indicator.good)
        ret.push('over the last')
        ret.push(this.window.humanSec)
        ret.push('>=')
        ret.push(percL10n(this.perc))
        return ret.join(' ')
    }
}
