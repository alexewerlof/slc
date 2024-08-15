import { currL10n, numL10n } from './fmt.js'
import { percent } from './math.js'
import { isNum, isPosInt, isStr } from './validation.js'
import { Window } from './window.js'

export class Budget extends Window {
    // Number of events in this cost window
    eventCount
    // The cost of one single event (used for calculating cost of the error budget for example)
    eventCost
    // The currency of the eventValue
    currency

    constructor(sec, eventUnit, timeslice, eventCount, eventCost, currency) {
        super(sec, eventUnit, timeslice)
        if (!Number.isInteger(eventCount)) {
            throw new TypeError(`Budget: eventCount must be an integer. Got ${ eventCount }`)
        }
        if (eventCount < 0) {
            throw new RangeError(`Budget: eventCount cannot be a negative number. Got ${ eventCount }`)
        }
        this.eventCount = eventCount

        if (!isNum(eventCost)) {
            throw new TypeError(`Budget: eventCost must be a number. Got ${ eventCost }`)
        }
        if (eventCost < 0) {
            throw new RangeError(`Budget: eventCost cannot be a negative number. Got ${ eventCost }`)
        }
        this.eventCost = eventCost
        
        if (!isStr(currency)) {
            throw new TypeError(`Budget: currency must be a string. Got ${ currency }`)
        }
        this.currency = currency
    }

    clone() {
        return new Budget(this.sec, this.eventUnit, this.timeslice, this.eventCount, this.eventCost, this.currency)
    }

    shrinkSec(perc) {
        const ret = this.clone()
        ret.sec = percent(perc, this.sec)
        return ret
    }

    shrink(perc) {
        const ret = this.shrinkSec(perc)
        ret.eventCount = Math.floor(percent(perc, this.eventCount))
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
        let ret = `${ this.eventCountL10n } bad ${ this.eventUnitNorm }`
        if (this.cost) {
            ret += ` costing ${ this.costL10n }`
        }
        ret += ` in ${ super.toString() }`
        return ret
    }
}
