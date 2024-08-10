import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { getTimeSlots, humanSec, humanTime, normalizeUnit } from "./time.js"
import { numL10n } from "./fmt.js"

Deno.test('humanTime()', () => {
    assertEquals(humanTime(10), '10 seconds')
    assertEquals(humanTime(60), '1 minute')
    assertEquals(humanTime(120), '2 minutes')
    assertEquals(humanTime(3600), '1 hour')
    assertEquals(humanTime(3660), '1 hour, 1 minute')
})

Deno.test('humanTime() short form', () => {
    assertEquals(humanTime(10, true), '10s')
    assertEquals(humanTime(60, true), '1m')
    assertEquals(humanTime(120, true), '2m')
    assertEquals(humanTime(3600, true), '1h')
    assertEquals(humanTime(3660, true), '1h, 1m')
})

Deno.test('humanSec()', () => {
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

Deno.test('getTimeSlots()', () => {
    assertEquals(getTimeSlots(60, 60), 1)
    assertEquals(getTimeSlots(3600, 60), 60)
    assertEquals(getTimeSlots(60.3, 60), 1.005)
})

Deno.test('normalizeUnit()', () => {
  assertEquals(normalizeUnit(1), 'seconds')
  assertEquals(normalizeUnit(60), 'minutes')
  assertEquals(normalizeUnit(3600), 'hours')
  assertEquals(normalizeUnit('events'), 'events')
  assertEquals(normalizeUnit(100), '100s_timeslots')
  assertEquals(normalizeUnit(300), '5m_timeslots')
  // Fallback
  assertEquals(normalizeUnit(''), 'events')
  // Errors
  assertThrows(() => normalizeUnit(undefined), TypeError)
  assertThrows(() => normalizeUnit(true), TypeError)
  assertThrows(() => normalizeUnit([]), TypeError)
})