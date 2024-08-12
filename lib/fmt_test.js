import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { currL10n, numL10n, strFallback, entity2symbol, hasComparators, numUnitL10n } from "./fmt.js"

Deno.test('numL10n()', () => {
    assertEquals(numL10n(10), '10')
    assertEquals(numL10n(1000), (new Intl.NumberFormat()).format('1000'))
})

Deno.test('numUnitL10n()', () => {
    assertEquals(numUnitL10n(10, 'ms'), '10 ms')
    assertEquals(numUnitL10n(1000, 'sec'), '1,000 sec')
    assertEquals(numUnitL10n(1000, undefined), '1,000')
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

Deno.test('hasComparators()', () => {
    assertEquals(hasComparators(''), false)
    assertEquals(hasComparators('x'), false)
    assertEquals(hasComparators('response.code < 500'), true)
    assertEquals(hasComparators('response.code ≤ 499'), true)
    assertEquals(hasComparators('utilization > 100'), true)
    assertEquals(hasComparators('utilization ≥ 200'), true)
})