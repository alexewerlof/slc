import { config } from "../config.js"
import { currL10n } from "../lib/fmt.js"

export class Budget {
    constructor(objective) {
        this.objective = objective
        this.currency = config.badEventCurrency.default
        this.avgUnitCost = 1 // config.badEventCost.default
        this.minUnitCost = 0.1
        this.maxUnitCost = 100
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
}