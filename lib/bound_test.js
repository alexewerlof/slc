import { config } from '../config.js'
import { test, assert, assertEquals, assertThrows } from '../vendor/deno.js'
import { oppositeBound } from './bound.js'

test('config defaults are as expected for the algorithm to work', () => {
    assert(config.lowerBound.default !== '' || config.upperBound.default !== '')
})

test('oppositeBound()', () => {
    assertEquals(oppositeBound(''), '')
    assertEquals(oppositeBound('lt'), 'gt')
    assertEquals(oppositeBound('le'), 'ge')
    assertEquals(oppositeBound('gt'), 'lt')
    assertEquals(oppositeBound('ge'), 'le')
    assertThrows(() => oppositeBound('foo'))
})