import { assert } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { inRangePosInt, isDef, isStr } from "./lib/validation.js"
import { config } from "./config.js"
import examples from './examples.js'

Deno.test('all examples are valid', () => {
    for (const example of examples) {
        Deno.test(`example: ${example.title}`, () => {
            const { title, description, unit, good, valid } = example
            assert(isStr(title))
            assert(isStr(description))
            assert(isStr(unit) || inRangePosInt(unit, config.timeSlot.min, config.timeSlot.max))
            assert(isStr(good))
            if (isDef(valid)) {
                assert(isStr(valid))
            }
        })
    }
})