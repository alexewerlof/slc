import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { numL10n, strFallback } from "./fmt.js"

Deno.test('numL10n()', () => {
    assertEquals(numL10n(10), '10')
    assertEquals(numL10n(1000), (new Intl.NumberFormat()).format('1000'))
})

Deno.test('strFallback()', () => {
    assertEquals(strFallback('', 'fallback'), 'fallback')
    assertEquals(strFallback(' ', 'fallback'), 'fallback')
    assertEquals(strFallback('x', 'fallback'), 'x')
    assertEquals(strFallback(' x', 'fallback'), ' x')
    assertEquals(strFallback('x ', 'fallback'), 'x ')
    assertEquals(strFallback('xy z', 'fallback'), 'xy z')
})