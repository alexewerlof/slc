import {
    assertEquals,
} from "https://deno.land/std/testing/asserts.ts"
import { config } from '../config.js'
import { defaultState, sanitizeState } from './state.js'

Deno.test('defaultState()', () => {
    const result = defaultState()
    assertEquals(result, {
        title: config.title.default,
        description: config.description.default,
        unit: config.unit.default,
        good: config.good.default,
        valid: config.valid.default,
        slo: config.slo.default,
        windowDays: config.windowDays.default,
        errorBudgetValidExample: config.errorBudgetValidExample.default,
        burnRate: config.burnRate.default,
        longWindowPerc: config.longWindowPerc.default,
        shortWindowDivider: config.shortWindowDivider.default,
    })
})

Deno.test('sanitizeState()', () => {
    Deno.test('falls back to the default title if the input is not string', () => {
        const result = sanitizeState({ title: 42 })
        assertEquals(result.title, config.title.default)
    })
})
