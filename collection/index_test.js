import { assertEquals, test } from '../vendor/deno.js'
import { isInstance, isStr } from '../lib/validation.js'
import { config } from '../config.js'
import { groups, importAllGroups } from './index.js'
import { Indicator } from '../components/indicator.js'

test('Indicator Templates', async (t) => {
    let items

    await t.step('Can load all indicator templates', async () => {
        items = await importAllGroups()
        assertEquals(Array.isArray(items), true)
        assertEquals(items.length > 0, true)
    })

    for (const { indicator, group, category } of items) {
        await t.step(`Indicator: ${indicator.title}`, () => {
            assertEquals(isInstance(indicator, Indicator), true, 'indicator is not an object')
            assertEquals(groups.includes(group), true, `invalid "group" field: ${group}`)
            assertEquals(
                isStr(category, config.displayName.minLength, config.displayName.maxLength),
                true,
                `invalid "category" field: ${category}`,
            )
        })
    }
})
