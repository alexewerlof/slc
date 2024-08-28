import { Indicator } from './indicator.js'
import { isInstance } from './validation.js'

export class Level {
    constructor(service, consumption) {
        this.service = service
        this.consumption = consumption
        this.indicators = []
    }

    addIndicator(indicator) {
        if (!isInstance(indicator, Indicator)) {
            throw new TypeError(`Level.addIndicator: indicator must be an instance of Indicator. Got ${ indicator }`)
        }
        indicator.level = this
        this.indicators.push(indicator)
    }

    addNewIndicator() {
        this.addIndicator(new Indicator(this))
    }
}