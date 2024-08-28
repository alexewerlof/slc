import { test, assertEquals, assertThrows} from "../vendor/deno.js"
import { Budget } from "./budget.js"
import { currL10n, numL10n } from "./fmt.js"

test('time-based Budget constructor', () => {
    const sec = 7200
    const eventUnit = 'valid2-events'
    const timeslice = 60
    const eventCount = 20
    const eventCost = 0.3
    const currency = 'EUR'
    const b = new Budget(sec, eventUnit, timeslice, eventCount, eventCost, currency)

    assertEquals(b.sec, sec)
    assertEquals(b.eventUnit, eventUnit)
    assertEquals(b.timeslice, timeslice)
    assertEquals(b.isTimeBased, true)
    assertEquals(b.eventUnitNorm, 'minutes')
    assertEquals(b.countTimeslices, 120)
    assertEquals(b.humanSec, `${ numL10n(sec) } sec`)
    assertEquals(b.humanTime, '2 hours')
    assertEquals(b.humanTimeSec, `${ b.humanTime } (${ b.humanSec })`)
    assertEquals(b.toString(), `${ eventCount } bad ${ b.eventUnitNorm } costing ${ currL10n(6, currency)} in ${ b.humanTime } (${ numL10n(sec) } sec = 120 minutes)`)
})

test('event-based Budget constructor', () => {
    const sec = 7500
    const eventUnit = 'valid3-events'
    const timeslice = -65
    const eventCount = 20
    const eventCost = 0.3
    const currency = 'CUP'
    const b = new Budget(sec, eventUnit, timeslice, eventCount, eventCost, currency)
    assertEquals(b.sec, sec)
    assertEquals(b.eventUnit, eventUnit)
    assertEquals(b.timeslice, timeslice)
    assertEquals(b.isTimeBased, false)
    assertEquals(b.eventUnitNorm, eventUnit)
    assertThrows(() => b.countTimeslices, Error)
    assertEquals(b.humanSec, `${ numL10n(sec) } sec`)
    assertEquals(b.humanTime, '2 hours, 5 minutes')
    assertEquals(b.humanTimeSec, `${ b.humanTime } (${ b.humanSec })`)
    assertEquals(b.toString(), `${ eventCount } bad ${ b.eventUnitNorm } costing ${ currL10n(6, currency)} in ${ b.humanTime } (${ numL10n(sec) } sec)`)
})

test('Budget constructor errors', () => {
    const set = 7000
    const eventUnit = 'valid45-events'
    const timeslice = 120
    const eventCount = 80
    const eventCost = 3
    const currency = 'SEK'

    assertThrows(() => new Budget(-1, eventUnit, timeslice, eventCount, eventCost, currency), RangeError)
    assertThrows(() => new Budget(set, 1, timeslice, eventCount, eventCost, currency), TypeError)
    assertThrows(() => new Budget(set, eventUnit, '60', eventCount, eventCost, currency), TypeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, '80', eventCost, currency), TypeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, -80, eventCost, currency), RangeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, eventCount, -3, currency), RangeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, eventCount, eventCost, 33), TypeError)
})

test('Budget.clone()', () => {
    const sec = 7500
    const eventUnit = 'valid3-events'
    const timeslice = 65
    const eventCount = 20
    const eventCost = 0.3
    const currency = 'USD'
    const b = new Budget(sec, eventUnit, timeslice, eventCount, eventCost, currency)
    const c = b.clone()
    assertEquals(c.sec, sec)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
    assertEquals(c.eventCount, eventCount)
    assertEquals(c.eventCost, eventCost)
    assertEquals(c.currency, currency)
})

test('Budget.shrinkSec()', () => {
    const sec = 8000
    const eventUnit = 'valid4-events'
    const timeslice = 300
    const eventCount = 180
    const eventCost = 2
    const currency = 'NOK'
    const b = new Budget(sec, eventUnit, timeslice, eventCount, eventCost, currency)
    const c = b.shrinkSec(50)
    assertEquals(c.sec, 4000)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
    assertEquals(c.eventCount, eventCount)
    assertEquals(c.eventCost, eventCost)
    assertEquals(c.currency, currency)
})

test('Budget.shrink()', () => {
    const sec = 4000
    const eventUnit = 'valid5-events'
    const timeslice = 120
    const eventCount = 80
    const eventCost = 3
    const currency = 'SEK'
    const b = new Budget(sec, eventUnit, timeslice, eventCount, eventCost, currency)
    const c = b.shrink(50)
    assertEquals(c.sec, 2000)
    assertEquals(c.eventCount, 40)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
    assertEquals(c.eventCost, eventCost)
    assertEquals(c.currency, currency)
})