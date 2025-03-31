import { assertEquals, assertThrows, test } from '../vendor/deno.js'
import { Window } from './window.js'
import { Indicator } from '../components/indicator.js'

const daySeconds = 24 * 60 * 60

test('event-based Window constructor', () => {
    const eventBasedIndicator = new Indicator()
    const w = new Window(eventBasedIndicator, daySeconds)
    assertEquals(w.isTimeBased, false)
    assertEquals(w.sec, daySeconds)
    assertEquals(w.eventUnitNorm, 'events')
})

test('time-based Window constructor', () => {
    const timeBasedIndicator = new Indicator({
        timeslice: 60,
    })
    const w = new Window(timeBasedIndicator, daySeconds)
    assertEquals(w.isTimeBased, true)
    assertEquals(w.sec, daySeconds)
    assertEquals(w.eventUnitNorm, 'minutes')
})

test('Window constructor errors', () => {
    assertThrows(() => new Window(undefined, daySeconds), TypeError)
    const indicator = new Indicator()
    assertThrows(() => new Window(indicator), TypeError)
    assertThrows(() => new Window(indicator, -1), RangeError)
    assertThrows(() => new Window(indicator, -daySeconds), RangeError)
})

test('Timeslice counting', () => {
    const indicator = new Indicator({
        timeslice: 60,
    })
    const w = new Window(indicator, daySeconds)
    assertEquals(w.countTimeslices, daySeconds / 60)
})
