import { BudgetTimeWindow } from "./budget-time-window.js"

export class ErrorBudget extends BudgetTimeWindow{
    constructor(slo) {
        this.slo = slo
    }

    set perc(val) {
        this.slo.perc = 100 - val
    }

    get perc() {
        return 100 - this.slo.perc
    }

    get percL10n() {
        return percL10n(this.perc)
    }
}
