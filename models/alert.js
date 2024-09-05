import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { percent } from '../lib/math.js'
import { TimeWindow } from './time-window.js'

export class Alert {
    constructor(objective) {
        this.objective = objective
        this.burnRate = config.burnRate.default
        this.shortWindowDivider = config.shortWindowDivider.default
        this.longWindowPerc = config.longWindowPerc.default
        this._exhaustWindow = new TimeWindow(this.objective, 0)
        this._longWindow = new TimeWindow(this.objective, 0)
        this._shortWindow = new TimeWindow(this.objective, 0)
        this._maxTTRWindow = new TimeWindow(this.objective, 0)
        this.useShortWindow = true
    }

    get exhaustWindow() {
        this._exhaustWindow.sec = this.objective.window.sec / this.burnRate
        return this._exhaustWindow
    }

    get longWindow() {
        this._longWindow.sec = percent(this.longWindowPerc, this.exhaustWindow.sec)
        return this._longWindow
    }

    get shortWindow() {
        this._shortWindow.sec = this.longWindow.sec / this.shortWindowDivider
        return this._shortWindow
    }

    get maxTTRWindow() {
        this._maxTTRWindow.sec = this.exhaustWindow.sec - this.longWindow.sec
        return this._maxTTRWindow
    }

    get badCount() {
        return this.objective.badCount * this.burnRate
    }

    get badCountLong() {
        return Math.floor(percent(this.longWindowPerc, this.objective.badCount))
    }

    get badCountShort() {
        return Math.floor(this.badCountLong / this.shortWindowDivider)
    }

    remove() {
        this.objective.removeAlert(this)
    }

    toString() {
        return `when ${ percL10n(this.longWindowPerc) } of error budget burns at ${this.burnRate}x`
    }
}
