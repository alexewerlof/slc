import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { currL10n, numL10n, strFallback, entity2symbol } from "./fmt.js"

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

Deno.test('currL10n()', () => {
    assertEquals(currL10n(100, 'USD'), (new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })).format(100))
})

Deno.test('entity2symbol()', () => {
    assertEquals(entity2symbol('lt'), '<')
    assertEquals(entity2symbol('le'), '≤')
    assertEquals(entity2symbol('gt'), '>')
    assertEquals(entity2symbol('ge'), '≥')
    assertEquals(entity2symbol(''), '')
    assertThrows(() => entity2symbol(undefined), Error('Unknown HTML entity: lte'))
    assertThrows(() => entity2symbol('lte'), Error('Unknown HTML entity: lte'))
})
