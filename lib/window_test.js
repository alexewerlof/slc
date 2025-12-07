import test from 'node:test'
import assert from 'node:assert/strict'
import { Window } from './window.js'
import { Indicator } from '../components/indicator.js'

const daySeconds = 24 * 60 * 60

test('event-based Window constructor', () => {
    const eventBasedIndicator = new Indicator()
    const w = new Window(eventBasedIndicator, daySeconds)
    assert.strictEqual(w.isTimeBased, false)
    assert.strictEqual(w.sec, daySeconds)
    assert.strictEqual(w.eventUnitNorm, 'events')
})

test('time-based Window constructor', () => {
    const timeBasedIndicator = new Indicator({
        timeslice: 60,
    })
    const w = new Window(timeBasedIndicator, daySeconds)
    assert.strictEqual(w.isTimeBased, true)
    assert.strictEqual(w.sec, daySeconds)
    assert.strictEqual(w.eventUnitNorm, 'minutes')
})

test('Window constructor errors', () => {
    assert.throws(() => new Window(undefined, daySeconds), TypeError)
    const indicator = new Indicator()
    assert.throws(() => new Window(indicator), TypeError)
    assert.throws(() => new Window(indicator, -1), RangeError)
    assert.throws(() => new Window(indicator, -daySeconds), RangeError)
})

test('Timeslice counting', () => {
    const indicator = new Indicator({
        timeslice: 60,
    })
    const w = new Window(indicator, daySeconds)
    assert.strictEqual(w.countTimeslices, daySeconds / 60)
})
