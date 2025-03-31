import { Indicator } from './indicator.js'
import { nextIndex } from '../lib/math.js'
import { isArr, isDef, isObj } from '../lib/validation.js'

export class Calculator {
    indicators = []
    _indicatorIdx = -1
    _objectiveIdx = -1
    _alertIdx = -1

    get indicatorIdx() {
        return this._indicatorIdx
    }

    set indicatorIdx(value) {
        this._indicatorIdx = value
        if (this.indicator?.objectives?.length) {
            this.objectiveIdx = 0
        }
    }

    get objectiveIdx() {
        return this._objectiveIdx
    }

    set objectiveIdx(value) {
        this._objectiveIdx = value
        if (this.objective?.alerts?.length) {
            this.alertIdx = 0
        }
    }

    get alertIdx() {
        return this._alertIdx
    }

    set alertIdx(value) {
        this._alertIdx = value
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
                this.indicatorIdx = 0
                if (this.indicator.objectives.length) {
                    this.objectiveIdx = 0
                    if (this.objective.alerts.length) {
                        this.alertIdx = 0
                    }
                }
            }
        }
    }
    get indicator() {
        return this.indicators[this.indicatorIdx]
    }
    set indicator(indicator) {
        const idx = this.indicators.indexOf(indicator)
        if (idx === -1) {
            throw new RangeError(`Indicator not found: ${indicator}`)
        }
        this.indicatorIdx = idx
    }
    removeSelectedIndicator() {
        this.indicatorIdx = nextIndex(this.indicators, this.indicatorIdx)
    }
    addIndicator(indicator) {
        this.indicators.push(indicator)
        this.indicatorIdx = this.indicators.length - 1
        this.objectiveIdx = -1
        this.alertIdx = -1
        return indicator
    }
    addNewIndicator() {
        return this.addIndicator(new Indicator())
    }
    removeSelectedObjective() {
        this.objectiveIdx = nextIndex(this.objectives, this.objectiveIdx)
    }
    removeSelectedAlert() {
        this.alertIdx = nextIndex(this.alerts, this.alertIdx)
    }
    addNewObjective() {
        const ret = this.indicator?.addNewObjective()
        this.objectiveIdx = this.objectives.length - 1
        this.alertIdx = -1
        return ret
    }
    addNewAlert() {
        const ret = this.objective?.addNewAlert()
        this.alertIdx = this.alerts.length - 1
        return ret
    }
    addRecommendedAlerts() {
        if (this.objective) {
            const alert1 = this.objective.addNewAlert()
            const alert2 = this.objective.addNewAlert()
            const alert3 = this.objective.addNewAlert()

            alert1.burnRate = 1
            alert1.longWindowPerc = 10
            alert1.useShortWindow = true

            alert2.burnRate = 6
            alert2.longWindowPerc = 5
            alert2.useShortWindow = true

            alert3.burnRate = 14.4
            alert3.longWindowPerc = 2
            alert3.useShortWindow = true

            this.alertIdx = this.alerts.length - 1
        }
    }
    get objectives() {
        return this.indicator?.objectives
    }
    get objective() {
        return this.objectives?.[this.objectiveIdx]
    }
    get alerts() {
        return this.objective?.alerts
    }
    get alert() {
        return this.objective?.alerts?.[this.alertIdx]
    }
    save() {
        // Save the calculator to a file
        return this.indicators.map((indicator) => indicator.save())
    }
}
