import { assert } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { inRangePosInt, isDef, isStr } from "./lib/validation.js"
import { config } from "./config.js"
import { templates } from './templates.js'

Deno.test('all templates are valid', () => {
    for (const template of templates) {
        Deno.test(`template: ${template.title}`, () => {
            const { title, description, unit, good, valid } = template
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