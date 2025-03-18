import { Indicator } from './indicator.js'

export class Calculator {
    indicators = []
    _indicatorIdx = -1
    constructor() {
        this.addNewIndicator()
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
}