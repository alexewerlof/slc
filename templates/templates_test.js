import { test, assert } from "../vendor/deno.js"
import { inRange, inRangePosInt, isDef, isStr } from "../lib/validation.js"
import { config } from "../config.js"
import { templates } from './templates.js'

for (const template of templates) {
    test(`Template: ${template.title}`, (t) => {
        const {
            title,
            description,
            timeslice,
            metricName,
            metricUnit,
            lowerBound,
            lowerThreshold,
            upperBound,
            upperThreshold,
            eventUnit,
            tags
        } = template
        assert(isStr(title), `invalid "title" field: ${title}`)
        assert(isStr(description), `invalid "description" field: ${description}`)
        if (isDef(timeslice)) {
            assert(!isDef(eventUnit), 'Cannot have both eventUnit and timeslice fields')
            assert(inRangePosInt(timeslice, config.timeslice.min, config.timeslice.max), `invalid timeslice : ${timeslice}`)
        }
        assert(isStr(metricName), `invalid "metricName" field: ${metricName}`)
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
        if (isDef(eventUnit)) {
            assert(isStr(eventUnit), `invalid "eventUnit" field: ${eventUnit}`)
        }
        assert(Array.isArray(tags), `invalid "tags" field: ${tags}`)
        for (const tag of tags) {
            assert(isStr(tag), `invalid "tag" in the tags array: ${tag}`)
        }
    })
}
