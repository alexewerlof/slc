import { currL10n, numL10n } from './fmt.js'
import { percent } from './math.js'
import { isNum, isStr } from './validation.js'

export class Budget {
    // Number of events in this cost window
    eventCount
    //
    eventUnit
    // The cost of one single event (used for calculating cost of the error budget for example)
    eventCost
    // The currency of the eventValue
    currency

    constructor(eventCount, eventUnit, eventCost, currency) {
        if (!isNum(eventCount) || !Number.isInteger(eventCount) || eventCount < 0) {
            throw new Error(`Budget: eventCount must be a positive number. Got ${ eventCount }`)
        }
        this.eventCount = eventCount

        if (!isStr(eventUnit)) {
            throw new Error(`Budget: eventUnit must be a string. Got ${ eventUnit }`)
        }
        this.eventUnit = eventUnit

        if (!isNum(eventCost) || eventCost < 0) {
            throw new Error(`Budget: eventCost must be a positive number. Got ${ eventCost }`)
        }
        this.eventCost = eventCost
        
        if (!isStr(currency)) {
            throw new Error(`Budget: currency must be a string. Got ${ currency }`)
        }
        this.currency = currency
    }

    newFractionalBudget(perc) {
        const eventCount = Math.floor(percent(perc, this.eventCount))
        return new Budget(eventCount, this.eventUnit, this.eventCost, this.currency)
    }

    get eventCountL10n() {
        return numL10n(this.eventCount)
    }

    get cost() {
        return this.eventCost * this.eventCount
    }

    get costL10n() {
        return currL10n(this.cost, this.currency)
    }

    toString() {
        return `${ this.eventCountL10n } ${ this.eventUnit } for ${ this.costL10n }`
    }
}
