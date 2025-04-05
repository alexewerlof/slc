import { assertEquals, test } from '../vendor/deno.js'
import { inRange, inRangePosInt, isDef, isStr, isStrLen } from '../lib/validation.js'
import { config } from '../config.js'
import { groups, importAllTemplates } from './index.js'

let templates

test('Templates', async (t) => {
    await t.step('Can load all templates', async () => {
        templates = await importAllTemplates()
        assertEquals(Array.isArray(templates), true)
        assertEquals(templates.length > 0, true)
    })

    for (const template of templates) {
        await t.step(`Template: ${template.title}`, () => {
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
                group,
            } = template
            assertEquals(
                isStrLen(title, config.displayName.minLength, config.displayName.maxLength),
                true,
                `invalid "title" field: ${title}`,
            )
            assertEquals(
                title.indexOf(':') > -1,
                true,
                `invalid "title" field: ${title}. Title must contain a colon (:)`,
            )
            assertEquals(
                isStrLen(description, config.description.minLength, config.description.maxLength),
                true,
                `invalid "description" field: ${description}`,
            )
            assertEquals(
                isDef(timeslice) && isDef(eventUnit),
                false,
                'Cannot have both eventUnit and timeslice fields',
            )
            if (isDef(timeslice)) {
                assertEquals(
                    inRangePosInt(
                        timeslice,
                        config.timeslice.min,
                        config.timeslice.max,
                    ),
                    true,
                    `invalid timeslice : ${timeslice}`,
                )
            }
            assertEquals(
                isStrLen(
                    metricName,
                    config.metricName.minLength,
                    config.metricName.maxLength,
                ),
                true,
                `invalid "metricName" field: ${metricName}`,
            )

            if (isDef(lowerBound)) {
                assertEquals(
                    config.lowerBound.possibleValues.includes(lowerBound),
                    true,
                    `invalid "lowerBound" field: ${lowerBound}`,
                )
            }

            if (isDef(upperBound)) {
                assertEquals(
                    config.upperBound.possibleValues.includes(upperBound),
                    true,
                    `invalid "upperBound" field: ${upperBound}`,
                )
            }

            if (isDef(lowerThreshold)) {
                assertEquals(
                    inRange(
                        lowerThreshold,
                        config.lowerThreshold.min,
                        config.lowerThreshold.max,
                    ),
                    true,
                    `invalid "lowerThreshold" field: ${lowerThreshold}`,
                )
            }

            if (isDef(upperThreshold)) {
                assertEquals(
                    inRange(
                        upperThreshold,
                        config.upperThreshold.min,
                        config.upperThreshold.max,
                    ),
                    true,
                    `invalid "upperThreshold" field: ${upperThreshold}`,
                )
            }

            if (isDef(lowerThreshold) && isDef(upperThreshold)) {
                assertEquals(
                    lowerThreshold < upperThreshold,
                    true,
                    `invalid thresholds: ${lowerThreshold} >= ${upperThreshold}`,
                )
            }

            if (isDef(metricUnit)) {
                assertEquals(
                    isStrLen(metricUnit, config.metricUnit.minLength, config.metricUnit.maxLength),
                    true,
                    `invalid "metricUnit" field: ${metricUnit}`,
                )
            }
            if (isDef(eventUnit)) {
                assertEquals(
                    isStrLen(eventUnit, config.eventUnit.minLength, config.eventUnit.maxLength),
                    true,
                    `invalid "eventUnit" field: ${eventUnit}`,
                )
            }

            assertEquals(isStr(group), true, `invalid "group" field: ${group}`)
            assertEquals(
                groups.includes(group),
                true,
                `invalid "group" field: ${group}`,
            )
        })
    }
})
