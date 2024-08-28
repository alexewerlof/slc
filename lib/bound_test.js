import { config } from '../config.js'
import { test, assert, assertEquals, assertThrows } from '../vendor/deno.js'

test('config defaults are as expected for the algorithm to work', () => {
    assert(config.lowerBound.default !== '' || config.upperBound.default !== '')
})
