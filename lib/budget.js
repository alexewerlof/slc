import { currL10n, numL10n } from './fmt.js'
import { percent } from './math.js'
import { isNum, isStr } from './validation.js'
import { Window } from './window.js'

export class Budget extends Window {
    // Number of events in this cost window
    eventCount
    // The cost of one single event (used for calculating cost of the error budget for example)
    eventCost
    // The currency of the eventValue
    currency

    constructor(sec, unit, eventCount, eventCost, currency) {
        super(sec, unit)
        if (!isNum(eventCount) || !Number.isInteger(eventCount) || eventCount < 0) {
            throw new Error(`Budget: eventCount must be a positive number. Got ${ eventCount }`)
        }
        this.eventCount = eventCount

        if (!isNum(eventCost) || eventCost < 0) {
            throw new Error(`Budget: eventCost must be a positive number. Got ${ eventCost }`)
        }
        this.eventCost = eventCost
        
        if (!isStr(currency)) {
            throw new Error(`Budget: currency must be a string. Got ${ currency }`)
        }
        this.currency = currency
    }

    clone() {
        return new Budget(this.sec, this.unit, this.eventCount, this.eventCost, this.currency)
    }

    shrink(perc) {
        const ret = this.shrinkWindow(perc)
        ret.eventCount = Math.floor(percent(perc, this.eventCount))
        return ret
    }

    shrinkWindow(perc) {
        const ret = this.clone()
        ret.sec = percent(perc, this.sec)
        return ret
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
        let ret = `${ this.eventCountL10n } bad ${ this.normUnit }`
        if (this.cost) {
            ret += ` costing ${ this.costL10n }`
        }
        ret += ` in ${ super.toString() }`
        return ret
    }
}
