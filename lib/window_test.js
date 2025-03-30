import { assertEquals, assertThrows, test } from '../vendor/deno.js'
import { Window } from './window.js'
import { Indicator } from '../components/indicator.js'

const daySeconds = 24 * 60 * 60

test('event-based Window constructor', () => {
    const eventBasedIndicator = new Indicator()
    const w = new Window(eventBasedIndicator, daySeconds)
    assertEquals(w.sec, daySeconds)
    assertEquals(w.isTimeBased, eventBasedIndicator.isTimeBased)
})

test('time-based Window constructor', () => {
    const timeBasedIndicator = new Indicator()
    const w = new Window(timeBasedIndicator, daySeconds)
    assertEquals(w.sec, daySeconds)
    assertEquals(w.isTimeBased, timeBasedIndicator.isTimeBased)
})

test('Window constructor errors', () => {
    assertThrows(() => new Window({}, daySeconds), TypeError)
    const indicator = new Indicator()
    assertThrows(() => new Window(indicator, 0), RangeError)
    assertThrows(() => new Window(indicator, -daySeconds), TypeError)
})
