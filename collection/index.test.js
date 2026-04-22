import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Indicator } from '../components/indicator.js'
import { isInstance } from '../lib/validation.js'
import { importAllGroups } from './index.js'

describe(importAllGroups.name, () => {
    it('loads indicators with expected type and category', async () => {
        const groups = await importAllGroups()
        for (const [groupName, indicators] of Object.entries(groups)) {
            assert.strictEqual(Array.isArray(indicators), true)
            for (const indicator of indicators) {
                assert.strictEqual(isInstance(indicator, Indicator), true)
                assert.strictEqual(indicator.category !== undefined, true)
            }
        }
    })
})
