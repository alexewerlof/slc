import { test, assertEquals, assertThrows} from "../vendor/deno.js"
import { Budget } from "./budget.js"
import { numL10n } from "./fmt.js"

test('time-based Budget constructor', () => {
    const sec = 7200
    const eventUnit = 'valid2-events'
    const timeslice = 60
    const eventCount = 20
    const b = new Budget(sec, eventUnit, timeslice, eventCount)

    assertEquals(b.sec, sec)
    assertEquals(b.eventUnit, eventUnit)
    assertEquals(b.timeslice, timeslice)
    assertEquals(b.isTimeBased, true)
    assertEquals(b.eventUnitNorm, 'minutes')
    assertEquals(b.countTimeslices, 120)
    assertEquals(b.humanSec, `${ numL10n(sec) } sec`)
    assertEquals(b.humanTime, '2 hours')
    assertEquals(b.humanTimeSec, `${ b.humanTime } (${ b.humanSec })`)
    assertEquals(b.toString(), `${ eventCount } bad ${ b.eventUnitNorm } in ${ b.humanTime } (${ numL10n(sec) } sec = 120 minutes)`)
})

test('event-based Budget constructor', () => {
    const sec = 7500
    const eventUnit = 'valid3-events'
    const timeslice = -65
    const eventCount = 20
    const b = new Budget(sec, eventUnit, timeslice, eventCount)
    assertEquals(b.sec, sec)
    assertEquals(b.eventUnit, eventUnit)
    assertEquals(b.timeslice, timeslice)
    assertEquals(b.isTimeBased, false)
    assertEquals(b.eventUnitNorm, eventUnit)
    assertThrows(() => b.countTimeslices, Error)
    assertEquals(b.humanSec, `${ numL10n(sec) } sec`)
    assertEquals(b.humanTime, '2 hours, 5 minutes')
    assertEquals(b.humanTimeSec, `${ b.humanTime } (${ b.humanSec })`)
    assertEquals(b.toString(), `${ eventCount } bad ${ b.eventUnitNorm } in ${ b.humanTime } (${ numL10n(sec) } sec)`)
})

test('Budget constructor errors', () => {
    const set = 7000
    const eventUnit = 'valid45-events'
    const timeslice = 120
    const eventCount = 80

    assertThrows(() => new Budget(-1, eventUnit, timeslice, eventCount), RangeError)
    assertThrows(() => new Budget(set, 1, timeslice, eventCount), TypeError)
    assertThrows(() => new Budget(set, eventUnit, '60', eventCount), TypeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, '80'), TypeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, -80), RangeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, eventCount), RangeError)
    assertThrows(() => new Budget(set, eventUnit, timeslice, eventCount), TypeError)
})

test('Budget.clone()', () => {
    const sec = 7500
    const eventUnit = 'valid3-events'
    const timeslice = 65
    const eventCount = 20
    const b = new Budget(sec, eventUnit, timeslice, eventCount)
    const c = b.clone()
    assertEquals(c.sec, sec)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
    assertEquals(c.eventCount, eventCount)
})

test('Budget.shrinkSec()', () => {
    const sec = 8000
    const eventUnit = 'valid4-events'
    const timeslice = 300
    const eventCount = 180
    const b = new Budget(sec, eventUnit, timeslice, eventCount)
    const c = b.shrinkSec(50)
    assertEquals(c.sec, 4000)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
    assertEquals(c.eventCount, eventCount)
})

test('Budget.shrink()', () => {
    const sec = 4000
    const eventUnit = 'valid5-events'
    const timeslice = 120
    const eventCount = 80
    const b = new Budget(sec, eventUnit, timeslice, eventCount)
    const c = b.shrink(50)
    assertEquals(c.sec, 2000)
    assertEquals(c.eventCount, 40)
    assertEquals(c.eventUnit, eventUnit)
    assertEquals(c.timeslice, timeslice)
})