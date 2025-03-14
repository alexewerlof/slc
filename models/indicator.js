import { config } from '../config.js'
import { humanTimeSlices } from '../lib/time.js'

/*
SLI budgeting method:
- event-based
- time-based
  - samples in regular intervals
  - aggregates values over time slices

By metric count:
- homogeneous (only good||bad metric)
- heterogeneous (good&&bad || good&&valid || bad&&valid metrics)

Metric data points impact its condition for good||bad:
- boolean
  - true || false
- numeric
  - range: UB&&LB || UB || LB (<, >, <=, >=) another name: below, above, between
  - point: ==, !=
*/

export class Indicator {
    // The title of the SLI
    title = config.title.default
    // The description of the SLI
    description = config.description.default
    // definition of valid events for event-based SLIs
    eventUnit = config.eventUnit.default
    // length of timeslice for time based SLIs. When it is negative, it indicates event based SLIs
    timeslice = config.timeslice.default
    // the metric that indicates whether an event or timeslice is good
    metricName = config.metricName.default
    // The unit of the metric that is used to identify good events
    metricUnit = config.metricUnit.default
    // The type of lower bound for the metric values that indicate a good event
    lowerBound = config.lowerBound.default
    // The type of upper bound for the metric values that indicate a good event
    upperBound = config.upperBound.default
    // whether the SLI is time-based or event-based
    get isTimeBased() {
        return this.timeslice > 0
    }
    set isTimeBased(newIsTimeBased) {
        this.timeslice = newIsTimeBased ? Math.abs(this.timeslice) : -Math.abs(this.timeslice)
    }
    get eventUnitNorm() {
            return this.isTimeBased ? humanTimeSlices(this.timeslice) : this.eventUnit
    }
    // Is there any bound
    get isBounded() {
        return Boolean(this.lowerBound) || Boolean(this.upperBound)
    }
    // Are both bounds needed
    get isRanged() {
        return Boolean(this.lowerBound) && Boolean(this.upperBound)
    }
}