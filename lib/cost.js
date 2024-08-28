import { config } from "../config.js"
import { currL10n } from "./fmt.js"

export class Cost {
    constructor(objective) {
        this.objective = objective
        this.currency = config.badEventCurrency.default
        this.avgUnitCost = 1 // config.badEventCost.default
        this.minUnitCost = 0.1
        this.maxUnitCost = 100
        this.use = true
    }

    calc(unitCount, unitCost) {
        return currL10n(unitCount * unitCost, this.currency)
    }

    avgCost(badEventCount) {
        return this.calc(badEventCount, this.avgUnitCost)
    }

    minCost(badEventCount) {
        return this.calc(badEventCount, this.minUnitCost)
    }

    maxCost(badEventCount) {
        return this.calc(badEventCount, this.maxUnitCost)
    }

    all(badEventCount) {
        const ret = []
        if (this.avgUnitCost) {
            ret.push('Average =')
            ret.push(this.avgCost(badEventCount))
        }
        if (this.minUnitCost) {
            ret.push('Minimum =')
            ret.push(this.minCost(badEventCount))
        }
        if (this.maxUnitCost) {
            ret.push('Maximum =')
            ret.push(this.maxCost(badEventCount))
        }
        return ret.join(' ')
    }
}