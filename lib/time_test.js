import { test, assertEquals, assertThrows } from "../vendor/deno.js"
import { countTimeslices, humanSec, humanTime, humanTimeSlices } from "./time.js"
import { numL10n } from "./fmt.js"

test('humanTime()', () => {
    assertEquals(humanTime(10), '10 seconds')
    assertEquals(humanTime(60), '1 minute')
    assertEquals(humanTime(120), '2 minutes')
    assertEquals(humanTime(3600), '1 hour')
    assertEquals(humanTime(3660), '1 hour, 1 minute')
})

test('humanTime() short form', () => {
    assertEquals(humanTime(10, true), '10s')
    assertEquals(humanTime(60, true), '1m')
    assertEquals(humanTime(120, true), '2m')
    assertEquals(humanTime(3600, true), '1h')
    assertEquals(humanTime(3660, true), '1h, 1m')
})

test('humanSec()', () => {
    assertEquals(humanSec(120), '120 sec')
    assertEquals(humanSec(60), '60 sec')
    assertEquals(humanSec(10), '10 sec')
    assertEquals(humanSec(10.1), '10 sec')
    assertEquals(humanSec(9.1), `${numL10n(9.1)} sec`)
    assertEquals(humanSec(9.01), '9 sec')
    assertEquals(humanSec(0.1), `${numL10n(0.1)} sec`)
    assertEquals(humanSec(0.01), `${numL10n(0.01)} sec`)
    assertEquals(humanSec(0.001), `${numL10n(0.001)} sec`)
    assertEquals(humanSec(0.0001), '0 sec')
    assertEquals(humanSec(0), '0 sec')
    assertThrows(() => humanSec(-1), TypeError)
    assertThrows(() => humanSec(''), TypeError)
    assertThrows(() => humanSec('1'), TypeError)
})

test('countTimeslices()', () => {
    assertEquals(countTimeslices(60, 60), 1)
    assertEquals(countTimeslices(3600, 60), 60)
    assertEquals(countTimeslices(60.3, 60), 1.005)
})

test('humanTimeSlices()', () => {
  assertEquals(humanTimeSlices(1), 'seconds')
  assertEquals(humanTimeSlices(60), 'minutes')
  assertEquals(humanTimeSlices(3600), 'hours')
  assertEquals(humanTimeSlices(100), '100s_timeslices')
  assertEquals(humanTimeSlices(300), '5m_timeslices')
  // Errors
  assertThrows(() => humanTimeSlices(''), TypeError)
  assertThrows(() => humanTimeSlices('events'), TypeError)
  assertThrows(() => humanTimeSlices(undefined), TypeError)
  assertThrows(() => humanTimeSlices(true), TypeError)
  assertThrows(() => humanTimeSlices([]), TypeError)
})