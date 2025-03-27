import { config } from '../config.js'
import { assert, assertEquals, assertThrows, test } from '../vendor/deno.js'

test('config defaults are as expected for the algorithm to work', () => {
    assert(config.lowerBound.default !== '' || config.upperBound.default !== '')
})
