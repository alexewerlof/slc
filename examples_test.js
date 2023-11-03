import { assert } from "https://deno.land/std/testing/asserts.ts"
import { inRangePosInt, isStr } from "./lib/validation.js"
import { config } from "./config.js"
import examples from './examples.js'

Deno.test('all examples are valid', () => {
    for (const example of examples) {
        const { title, description, unit, good, valid } = example
        assert(isStr(title))
        assert(isStr(description))
        assert(isStr(unit) || inRangePosInt(unit, config.timeSlot.min, config.timeSlot.max))
        assert(isStr(good))
        assert(isStr(valid))
    }
})