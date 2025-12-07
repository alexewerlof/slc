/* This self-standing node.js script is designed to export current SLI templates to markdown format for LLM fine tuning */

import { importAllGroups } from './index.js'

const indicatorGroups = await importAllGroups()
for (const [groupName, indicators] of Object.entries(indicatorGroups)) {
    console.log()
    console.log(`# ${groupName}`)
    console.log()
    for (const indicator of indicators) {
        console.log(`## ${indicator}`)
        console.log(`Formula: ${indicator.formula}`)
        console.log(`Metric: ${indicator.metricName}`)
        console.log(`Unit: ${indicator.eventUnitNorm}`)
        console.log()
    }
}
