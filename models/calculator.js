import { Indicator } from './indicator.js'

export class Calculator {
    indicators = []
    _indicatorIdx = -1
    _objectiveIdx = -1
    _alertIdx = -1
    constructor() {
        this.addNewIndicator()
        this._indicatorIdx = 0
        this.indicator.addNewObjective()
        this._objectiveIdx = 0
        this.objective.addNewAlert()
        this._alertIdx = 0
    }
    get indicator() {
        return this.indicators[this._indicatorIdx]
    }
    set indicator(indicator) {
        const idx = this.indicators.indexOf(indicator)
        if (idx === -1) {
            throw new RangeError(`UptimeApp.selectedIndicator(): Indicator not found: ${indicator}`)
        }
        this._indicatorIdx = idx
    }
    removeSelectedIndicator() {
        if (this._indicatorIdx === -1) {
            throw new RangeError(`UptimeApp.removeIndicator(): Indicator not found: ${indicator}`)
        }
        this.indicators.splice(this._indicatorIdx, 1)
        this._selectedIndicatorIdx = nextIndex(this.indicators, idx)
    }
    addIndicator(indicator) {
        indicator.app = this
        this.indicators.push(indicator)
        return indicator
    }
    addNewIndicator() {
        const newIndicator = new Indicator(this)
        this.addIndicator(newIndicator)
        this._selectedIndicatorIdx = this.indicators.length - 1
        return newIndicator
    }
    get objectives() {
        return this.indicator.objectives
    }
    get objective() {
        return this.objectives[this._objectiveIdx]
    }
    get alerts() {
        return this.objective.alerts
    }
    get alert() {
        return this.objective.alerts[this._alertIdx]
    }
    save() {
        // Save the calculator to a file
        return this.indicators.map(indicator => indicator.save())
    }
}