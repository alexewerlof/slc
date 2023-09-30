import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { humanTime } from "./time.js"

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