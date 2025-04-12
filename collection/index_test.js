import { Indicator } from '../components/indicator.js'
import { isInstance } from '../lib/validation.js'
import { assertEquals, test } from '../vendor/deno.js'
import { importAllGroups } from './index.js'

test('Indicator Templates', async (t) => {
    const groups = await importAllGroups()
    for (const [groupName, indicators] of Object.entries(groups)) {
        assertEquals(Array.isArray(indicators), true)
        for (const indicator of indicators) {
            await t.step(`Entry in ${groupName} is an instances of Indicator `, () => {
                assertEquals(isInstance(indicator, Indicator), true)
            })
            await t.step(`Indicator in ${groupName} has a category`, () => {
                assertEquals(indicator.category !== undefined, true)
            })
        }
    }
})
