import test from 'node:test'
import assert from 'node:assert/strict'

import {
    boundCaption,
    entity2symbol,
    hasComparators,
    namify,
    numL10n,
    numUnitL10n,
    oppositeBound,
    strFallback,
} from './fmt.js'

test('numL10n()', () => {
    assert.strictEqual(numL10n(10), '10')
    assert.strictEqual(numL10n(1000), (new Intl.NumberFormat()).format('1000'))
})

test('numUnitL10n()', () => {
    assert.strictEqual(numUnitL10n(10, 'ms'), '10 ms')
    assert.strictEqual(numUnitL10n(1000, 'sec'), '1,000 sec')
    assert.strictEqual(numUnitL10n(1000, undefined), '1,000')
})

test('strFallback()', () => {
    assert.strictEqual(strFallback('', 'fallback'), 'fallback')
    assert.strictEqual(strFallback(' ', 'fallback'), 'fallback')
    assert.strictEqual(strFallback('x', 'fallback'), 'x')
    assert.strictEqual(strFallback(' x', 'fallback'), ' x')
    assert.strictEqual(strFallback('x ', 'fallback'), 'x ')
    assert.strictEqual(strFallback('xy z', 'fallback'), 'xy z')
})

test('entity2symbol()', () => {
    assert.strictEqual(entity2symbol('lt'), '<')
    assert.strictEqual(entity2symbol('le'), '≤')
    assert.strictEqual(entity2symbol('gt'), '>')
    assert.strictEqual(entity2symbol('ge'), '≥')
    assert.throws(() => entity2symbol(''), Error('Unknown HTML entity: '))
    assert.throws(() => entity2symbol(undefined), Error('Unknown HTML entity: undefined'))
    assert.throws(() => entity2symbol('lte'), Error('Unknown HTML entity: lte'))
})

test('hasComparators()', () => {
    assert.strictEqual(hasComparators(''), false)
    assert.strictEqual(hasComparators('x'), false)
    assert.strictEqual(hasComparators('response.code < 500'), true)
    assert.strictEqual(hasComparators('response.code ≤ 499'), true)
    assert.strictEqual(hasComparators('utilization > 100'), true)
    assert.strictEqual(hasComparators('utilization ≥ 200'), true)
})

test('boundCaption()', () => {
    assert.strictEqual(boundCaption('probe.status', '', 'this should not show up'), 'None')
    assert.strictEqual(boundCaption('response.code', 'lt', '500'), 'response.code < 500')
    assert.strictEqual(boundCaption('response.latency', 'le', '2000'), 'response.latency ≤ 2000')
    assert.strictEqual(boundCaption('cpu.utilization', 'gt', '50'), 'cpu.utilization > 50')
    assert.strictEqual(boundCaption('llm.tps', 'ge', '10'), 'llm.tps ≥ 10')
})

test('oppositeBound()', () => {
    assert.strictEqual(oppositeBound('eq'), 'ne')
    assert.strictEqual(oppositeBound('ne'), 'eq')
    assert.strictEqual(oppositeBound('lt'), 'ge')
    assert.strictEqual(oppositeBound('le'), 'gt')
    assert.strictEqual(oppositeBound('gt'), 'le')
    assert.strictEqual(oppositeBound('ge'), 'lt')
    assert.throws(() => oppositeBound(''), Error(`Invalid bound: `))
    assert.throws(() => oppositeBound('foo'), Error(`Invalid bound: foo`))
})

test('namify()', () => {
    assert.strictEqual(namify('foo'), 'foo')
    assert.strictEqual(namify('fooBar'), 'foo-bar')
    assert.strictEqual(namify('foo', 'Bar'), 'foo.bar')
    assert.strictEqual(namify(' fooBar'), 'foo-bar')
    assert.strictEqual(namify('.foo '), '.foo')
    assert.strictEqual(namify('alexEwerlöf'), 'alex-ewerl-f')
    assert.strictEqual(namify('12 Signals'), '12-signals')
    assert.strictEqual(namify('Test__snake'), 'test-snake')
    assert.strictEqual(namify('Test.Dot'), 'test.dot')
    assert.strictEqual(namify('Test/slash'), 'test/slash')
    assert.strictEqual(namify('Test\\backslash'), 'test\\backslash')

    assert.throws(() => namify(''))
    assert.throws(() => namify(undefined))
    assert.throws(() => namify(null))
    assert.throws(() => namify(42))
    assert.throws(() => namify('  '))
})
