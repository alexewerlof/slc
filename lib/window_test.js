import { test, assertEquals, assertThrows } from "../vendor/deno.js"
import { Window } from "./window.js"
import { numL10n } from "./fmt.js"

test('event-based Window constructor', () => {
    const w = new Window(3600, 'valid1', 0)
    assertEquals(w.sec, 3600)
    assertEquals(w.eventUnit, 'valid1')
    assertEquals(w.timeslice, 0)
    assertEquals(w.isTimeBased, false)
    assertEquals(w.eventUnitNorm, 'valid1')
    assertThrows(() => w.countTimeslices, Error)
    assertEquals(w.humanSec, `${ numL10n(3600) } sec`)
    assertEquals(w.humanTime, '1 hour')
    assertEquals(w.humanTimeSec, `${ w.humanTime } (${ w.humanSec })`)
    assertEquals(w.toString(), `1 hour (${ numL10n(3600) } sec)`)
})

test('time-based Window constructor', () => {
    const w = new Window(18000, 'valid2', 60)
    assertEquals(w.sec, 18000)
    assertEquals(w.eventUnit, 'valid2')
    assertEquals(w.timeslice, 60)
    assertEquals(w.isTimeBased, true)
    assertEquals(w.eventUnitNorm, 'minutes')
    assertEquals(w.countTimeslices, 300)
    assertEquals(w.humanSec, `${ numL10n(18000) } sec`)
    assertEquals(w.humanTime, '5 hours')
    assertEquals(w.humanTimeSec, `${ w.humanTime } (${ w.humanSec })`)
    assertEquals(w.toString(), `${ w.humanTime } (${ numL10n(18000) } sec = 300 minutes)`)
})

test('Negative timeslice leads to event based window', () => {
    const w = new Window(3600, 'valid3', -60)
    assertEquals(w.isTimeBased, false)
    assertEquals(w.eventUnitNorm, 'valid3')
    w.timeslice = 0
    assertEquals(w.isTimeBased, false)
    w.timeslice = 1
    assertEquals(w.isTimeBased, true)
})

test('Window constructor errors', () => {
    assertThrows(() => new Window(-1, 'valid4', 60), RangeError)
    assertThrows(() => new Window(7200, 1, 60), TypeError)
    assertThrows(() => new Window(10800, 'valid4', '60'), TypeError)
    assertThrows(() => new Window(14400, 'valid4', '60'), TypeError)
    assertThrows(() => new Window(18000, 'valid4', '60'), TypeError)
})
