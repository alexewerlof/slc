import { numL10n } from './fmt.js'
import { percent } from './math.js'
import { Window } from './window.js'

export class Budget extends Window {
    // Number of events in this window
    eventCount

    constructor(indicator, sec, eventCount) {
        super(indicator, sec)
        if (!Number.isInteger(eventCount)) {
            throw new TypeError(`Budget: eventCount must be an integer. Got ${ eventCount }`)
        }
        if (eventCount < 0) {
            throw new RangeError(`Budget: eventCount cannot be a negative number. Got ${ eventCount }`)
        }
        this.eventCount = eventCount
    }

    clone() {
        return new Budget(this.indicator, this.sec, this.eventCount)
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

    toString() {
        let ret = `${ this.eventCountL10n } bad ${ this.indicator.eventUnitNorm }`
        ret += ` in ${ super.toString() }`
        return ret
    }
}
