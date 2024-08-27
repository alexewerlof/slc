import { config } from "../config.js"
import { percent } from "../lib/math.js"
import { TimeWindow } from "./time-window.js"

export class Alert {
    constructor(slo) {
        this.objective = slo
        this.burnRate = config.burnRate.default
        this.useShortWindow = false
        this._shortWindowDivider = config.shortWindowDivider.default
        this._longWindowPerc = config.longWindowPerc.default
        this.longWindow = new TimeWindow(this.objective, percent(this._longWindowPerc, this.exhaustSec))
        this.shortWindow = new TimeWindow(this.objective, this.longWindow.sec / this.shortWindowDivider)
    }

    get exhaustSec() {
        return this.objective.window.sec / this.burnRate
    }

    get burnRate() {
        return this._burnRate
    }

    set burnRate(val) {
        this._burnRate = val
    }

    get longWindowPerc() {
        return this._longWindowPerc
    }

    set longWindowPerc(val) {
        this.longWindow.sec = percent(val, this.objective.window.sec)
        this._longWindowPerc = val
    }

    get shortWindowDivider() {
        return this._shortWindowDivider
    }

    set shortWindowDivider(val) {
        this.shortWindow.sec = this.objective.window.sec / val
        this._shortWindowDivider = val
    }
}
