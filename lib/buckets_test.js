import { test, assertEquals } from '../vendor/deno.js'
import { createBuckets } from './buckets.js'

test('createBuckets()', () => {
    assertEquals(
        createBuckets(0, 100, [100, 50, 25, 25]),
        [
            { min: 0, max: 25, probability: 50 },
            { min: 25, max: 50, probability: 25 },
            { min: 50, max: 75, probability: 12.5 },
            { min: 75, max: 100, probability: 12.5 },
        ],
        'can create buckets'
    )
})