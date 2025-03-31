import { Indicator } from './indicator.js'
import { nextIndex } from '../lib/math.js'
import { isArr, isDef, isObj } from '../lib/validation.js'

export class Calculator {
    indicators = []
    _selIndicatorIdx = -1

    get selIndicatorIdx() {
        return this._selIndicatorIdx
    }

    set selIndicatorIdx(value) {
        this._selIndicatorIdx = value
        if (this.selIndicator?.objectives?.length) {
            this.objectiveIdx = 0
        }
    }

    get selIndicator() {
        return this.indicators[this.selIndicatorIdx]
    }

    addIndicator(indicator) {
        this.indicators.push(indicator)
        this.selIndicatorIdx = this.indicators.length - 1
        this.selObjectiveIdx = -1
        this.selAlertIdx = -1
        return indicator
    }

    addNewIndicator() {
        return this.addIndicator(new Indicator())
    }

    removeSelectedIndicator() {
        this.selIndicatorIdx = nextIndex(this.indicators, this.selIndicatorIdx)
    }

    _selObjectiveIdx = -1

    get selObjectiveIdx() {
        return this._selObjectiveIdx
    }

    set selObjectiveIdx(value) {
        this._selObjectiveIdx = value
        if (this.selObjective?.alerts?.length) {
            this.selAlertIdx = 0
        }
    }

    get selObjective() {
        return this.objectives?.[this.selObjectiveIdx]
    }

    addNewObjective() {
        const ret = this.selIndicator?.addNewObjective()
        this.selObjectiveIdx = this.objectives.length - 1
        this.selAlertIdx = -1
        return ret
    }

    removeSelectedObjective() {
        this.selObjectiveIdx = nextIndex(this.objectives, this.selObjectiveIdx)
    }

    _selAlertIdx = -1

    get selAlertIdx() {
        return this._selAlertIdx
    }

    set selAlertIdx(value) {
        this._selAlertIdx = value
    }

    get selAlert() {
        return this.selObjective?.alerts?.[this.selAlertIdx]
    }

    addNewAlert() {
        const ret = this.selObjective?.addNewAlert()
        this.selAlertIdx = this.alerts.length - 1
        return ret
    }

    removeSelectedAlert() {
        this.selAlertIdx = nextIndex(this.alerts, this.selAlertIdx)
    }

    addRecommendedAlerts() {
        if (this.selObjective) {
            const alert1 = this.selObjective.addNewAlert()
            const alert2 = this.selObjective.addNewAlert()
            const alert3 = this.selObjective.addNewAlert()

            alert1.burnRate = 1
            alert1.longWindowPerc = 10
            alert1.useShortWindow = true

            alert2.burnRate = 6
            alert2.longWindowPerc = 5
            alert2.useShortWindow = true

            alert3.burnRate = 14.4
            alert3.longWindowPerc = 2
            alert3.useShortWindow = true

            this.selAlertIdx = this.alerts.length - 1
        }
    }

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
                this.selIndicatorIdx = 0
                if (this.selIndicator.objectives.length) {
                    this.selObjectiveIdx = 0
                    if (this.selObjective.alerts.length) {
                        this.selAlertIdx = 0
                    }
                }
            }
        }
    }

    get objectives() {
        return this.selIndicator?.objectives
    }

    get alerts() {
        return this.selObjective?.alerts
    }

    save() {
        // Save the calculator to a file
        return { indicators: this.indicators.map((indicator) => indicator.save()) }
    }
}
