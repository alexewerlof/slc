import { test, assertEquals, assertThrows } from "../vendor/deno.js"
import { currL10n, numL10n, strFallback, entity2symbol, hasComparators, numUnitL10n, boundCaption, oppositeBound } from "./fmt.js"

test('numL10n()', () => {
    assertEquals(numL10n(10), '10')
    assertEquals(numL10n(1000), (new Intl.NumberFormat()).format('1000'))
})

test('numUnitL10n()', () => {
    assertEquals(numUnitL10n(10, 'ms'), '10 ms')
    assertEquals(numUnitL10n(1000, 'sec'), '1,000 sec')
    assertEquals(numUnitL10n(1000, undefined), '1,000')
})

test('strFallback()', () => {
    assertEquals(strFallback('', 'fallback'), 'fallback')
    assertEquals(strFallback(' ', 'fallback'), 'fallback')
    assertEquals(strFallback('x', 'fallback'), 'x')
    assertEquals(strFallback(' x', 'fallback'), ' x')
    assertEquals(strFallback('x ', 'fallback'), 'x ')
    assertEquals(strFallback('xy z', 'fallback'), 'xy z')
})

test('currL10n()', () => {
    assertEquals(currL10n(100, 'USD'), (new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })).format(100))
})

test('entity2symbol()', () => {
    assertEquals(entity2symbol('lt'), '<')
    assertEquals(entity2symbol('le'), '≤')
    assertEquals(entity2symbol('gt'), '>')
    assertEquals(entity2symbol('ge'), '≥')
    assertEquals(entity2symbol(''), '')
    assertThrows(() => entity2symbol(undefined), Error('Unknown HTML entity: lte'))
    assertThrows(() => entity2symbol('lte'), Error('Unknown HTML entity: lte'))
})

test('hasComparators()', () => {
    assertEquals(hasComparators(''), false)
    assertEquals(hasComparators('x'), false)
    assertEquals(hasComparators('response.code < 500'), true)
    assertEquals(hasComparators('response.code ≤ 499'), true)
    assertEquals(hasComparators('utilization > 100'), true)
    assertEquals(hasComparators('utilization ≥ 200'), true)
})

test('boundCaption()', () => {
    assertEquals(boundCaption('probe.status', '', 'this should not show up'), 'None')
    assertEquals(boundCaption('response.code', 'lt', '500'), 'response.code < 500')
    assertEquals(boundCaption('response.latency', 'le', '2000'), 'response.latency ≤ 2000')
    assertEquals(boundCaption('cpu.utilization', 'gt', '50'), 'cpu.utilization > 50')
    assertEquals(boundCaption('llm.tps', 'ge', '10'), 'llm.tps ≥ 10')
})

test('oppositeBound()', () => {
    assertEquals(oppositeBound(''), '')
    assertEquals(oppositeBound('lt'), 'gt')
    assertEquals(oppositeBound('le'), 'ge')
    assertEquals(oppositeBound('gt'), 'lt')
    assertEquals(oppositeBound('ge'), 'le')
    assertThrows(() => oppositeBound('foo'))
})