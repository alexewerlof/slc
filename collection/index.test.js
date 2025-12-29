import test from 'node:test'
import assert from 'node:assert/strict'
import { Indicator } from '../components/indicator.js'
import { isInstance } from '../lib/validation.js'
import { importAllGroups } from './index.js'

test('Indicator Templates', async (t) => {
    const groups = await importAllGroups()
    for (const [groupName, indicators] of Object.entries(groups)) {
        assert.strictEqual(Array.isArray(indicators), true)
        for (const indicator of indicators) {
            await t.test(`Entry in ${groupName} is an instances of Indicator `, () => {
                assert.strictEqual(isInstance(indicator, Indicator), true)
            })
            await t.test(`Indicator in ${groupName} has a category`, () => {
                assert.strictEqual(indicator.category !== undefined, true)
            })
        }
    }
})
