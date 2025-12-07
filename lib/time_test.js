import test from 'node:test'
import assert from 'node:assert/strict'
import { countTimeslices, humanSec, humanTime, humanTimeSlices } from './time.js'
import { numL10n } from './fmt.js'

test('humanTime()', () => {
    assert.strictEqual(humanTime(10), '10 seconds')
    assert.strictEqual(humanTime(60), '1 minute')
    assert.strictEqual(humanTime(120), '2 minutes')
    assert.strictEqual(humanTime(3600), '1 hour')
    assert.strictEqual(humanTime(3660), '1 hour, 1 minute')
})

test('humanTime() short form', () => {
    assert.strictEqual(humanTime(10, true), '10s')
    assert.strictEqual(humanTime(60, true), '1m')
    assert.strictEqual(humanTime(120, true), '2m')
    assert.strictEqual(humanTime(3600, true), '1h')
    assert.strictEqual(humanTime(3660, true), '1h, 1m')
})

test('humanSec()', () => {
    assert.strictEqual(humanSec(120), '120 sec')
    assert.strictEqual(humanSec(60), '60 sec')
    assert.strictEqual(humanSec(10), '10 sec')
    assert.strictEqual(humanSec(10.1), '10 sec')
    assert.strictEqual(humanSec(9.1), `${numL10n(9.1)} sec`)
    assert.strictEqual(humanSec(9.01), '9 sec')
    assert.strictEqual(humanSec(0.1), `${numL10n(0.1)} sec`)
    assert.strictEqual(humanSec(0.01), `${numL10n(0.01)} sec`)
    assert.strictEqual(humanSec(0.001), `${numL10n(0.001)} sec`)
    assert.strictEqual(humanSec(0.0001), '0 sec')
    assert.strictEqual(humanSec(0), '0 sec')
    assert.throws(() => humanSec(-1), TypeError)
    assert.throws(() => humanSec(''), TypeError)
    assert.throws(() => humanSec('1'), TypeError)
})

test('countTimeslices()', () => {
    assert.strictEqual(countTimeslices(60, 60), 1)
    assert.strictEqual(countTimeslices(3600, 60), 60)
    assert.strictEqual(countTimeslices(60.3, 60), 1.005)
})

test('humanTimeSlices()', () => {
    assert.strictEqual(humanTimeSlices(1), 'seconds')
    assert.strictEqual(humanTimeSlices(60), 'minutes')
    assert.strictEqual(humanTimeSlices(3600), 'hours')
    assert.strictEqual(humanTimeSlices(100), '100s_timeslices')
    assert.strictEqual(humanTimeSlices(300), '5m_timeslices')
    // Errors
    assert.throws(() => humanTimeSlices(''), TypeError)
    assert.throws(() => humanTimeSlices('events'), TypeError)
    assert.throws(() => humanTimeSlices(undefined), TypeError)
    assert.throws(() => humanTimeSlices(true), TypeError)
    assert.throws(() => humanTimeSlices([]), TypeError)
})
