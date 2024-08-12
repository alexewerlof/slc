import { assert } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { inRange, inRangePosInt, isDef, isStr } from "../lib/validation.js"
import { config } from "../config.js"
import { templates } from './templates.js'

for (const template of templates) {
    Deno.test(`Template: ${template.title}`, (t) => {
        const {
            title,
            description,
            timeslice,
            good,
            metricUnit,
            lowerBound,
            lowerThreshold,
            upperBound,
            upperThreshold,
            valid,
            tags
        } = template
        assert(isStr(title), `invalid "title" field: ${title}`)
        assert(isStr(description), `invalid "description" field: ${description}`)
        if (isDef(timeslice)) {
            assert(!isDef(valid), 'Cannot have both valid and timeslice fields')
            assert(inRangePosInt(timeslice, config.timeslice.min, config.timeslice.max), `invalid timeslice : ${timeslice}`)
        }
        assert(isStr(good), `invalid "good" field: ${good}`)
        if (isDef(lowerBound)) {
            assert(config.lowerBound.possibleValues.includes(lowerBound), `invalid "lowerBound" field: ${lowerBound}`)
        }
        if (isDef(lowerThreshold)) {
            assert(inRange(lowerThreshold, config.lowerThreshold.min, config.lowerThreshold.max), `invalid "lowerThreshold" field: ${lowerThreshold}`)
        }
        if (isDef(upperBound)) {
            assert(config.upperBound.possibleValues.includes(upperBound), `invalid "upperBound" field: ${upperBound}`)
        }
        if (isDef(upperThreshold)) {
            assert(inRange(upperThreshold, config.upperThreshold.min, config.upperThreshold.max), `invalid "upperThreshold" field: ${upperThreshold}`)
        }
        if (isDef(lowerThreshold) && isDef(upperThreshold)) {
            assert(lowerThreshold < upperThreshold, `invalid thresholds: ${lowerThreshold} >= ${upperThreshold}`)
        }
        if(isDef(metricUnit)) {
            assert(isStr(metricUnit), `invalid "metricUnit" field: ${metricUnit}`)
        }
        if (isDef(valid)) {
            assert(isStr(valid), `invalid "valid" field: ${valid}`)
        }
        assert(Array.isArray(tags), `invalid "tags" field: ${tags}`)
        for (const tag of tags) {
            assert(isStr(tag), `invalid "tag" in the tags array: ${tag}`)
        }
    })
}
