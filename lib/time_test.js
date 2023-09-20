import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { findWindowUnitFromShortTitle, humanTime, parseWindow } from "./time.js"

Deno.test('findWindowUnitFromShortTitle()', () => {
    assertEquals(findWindowUnitFromShortTitle('M'), {
        title: 'month',
        shortTitle: 'M',
        sec: 30 * 24 * 60 * 60,
        max: 12,
    })
})

Deno.test('parseWindow()', () => {
    assertEquals(parseWindow('4w'), [
        4,
        {
            title: 'week',
            shortTitle: 'w',
            sec: 7 * 24 * 60 * 60,
            max: 4,
        }
    ])
})

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