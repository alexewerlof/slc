import { Indicator } from './indicator.js'
import { nextIndex } from '../lib/math.js'
import { isArr } from '../lib/validation.js'

export class Calculator {
    indicators = []
    indicatorIdx = -1
    objectiveIdx = -1
    alertIdx = -1
    constructor() {
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
        return this.addIndicator(new Indicator(this))
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
    static load(data) {
        const ret = new Calculator()
        if (!isArr(data?.state?.indicators)) {
            throw new TypeError(
                `Expected an array of indicators in the state. State: ${JSON.stringify(state, null, 2)}, ${
                    JSON.stringify(state.indicators, null, 2)
                }`,
            )
        }
        for (const indicatorData of data.state.indicators) {
            ret.addIndicator(Indicator.load(indicatorData))
        }
        if (ret.indicators.length) {
            ret.indicatorIdx = 0
            if (ret.indicator.objectives.length) {
                ret.objectiveIdx = 0
                if (ret.objective.alerts.length) {
                    ret.alertIdx = 0
                }
            }
        }
        return ret
    }
}
