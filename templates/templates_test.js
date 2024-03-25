import { assert } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { inRangePosInt, isDef, isStr } from "../lib/validation.js"
import { config } from "../config.js"
import { templates } from './templates.js'

for (const template of templates) {
    Deno.test(`Template: ${template.title}`, (t) => {
        const { title, description, unit, good, valid, tags } = template
        assert(isStr(title), `invalid "title" field: ${title}`)
        assert(isStr(description), `invalid "description" field: ${description}`)
        assert(isStr(unit) || inRangePosInt(unit, config.timeSlot.min, config.timeSlot.max), `invalid "unit" field : ${unit}`)
        assert(isStr(good), `invalid "good" field: ${good}`)
        if (isDef(valid)) {
            assert(isStr(valid), `invalid "valid" field: ${valid}`)
        }
        assert(Array.isArray(tags), `invalid "tags" field: ${tags}`)
        for (const tag of tags) {
            assert(isStr(tag), `invalid "tag" in the tags array: ${tag}`)
        }
    })
}
