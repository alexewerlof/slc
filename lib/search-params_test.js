import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { convertParam, getSearchParams, setSearchParams } from './search-params.js'

Deno.test('convertParam()', () => {
    assertEquals(convertParam(String, 'hello'), 'hello')
    assertEquals(convertParam(Number, '42'), 42)
    assertEquals(convertParam(Number, 'foo'), undefined)
    assertThrows(() => convertParam(Boolean, 'foo'))
})

Deno.test('getSearchParams()', () => {
    const descriptor = {
        title: String,
        description: String,
        unit: Number,
        good: String,
        valid: String,
        slo: Number,
        windowDays: Number,
        estimatedValidEvents: Number,
        badEventCost: Number,
        badEventCurrency: String,
        burnRate: Number,
        longWindowPerc: Number,
        shortWindowDivider: Number,
    }

    const url = new URL('https://example.com/?title=hello&description=world&windowDays=30&foo=bar')
    const params = getSearchParams(descriptor, url)
    assertEquals(params, {
        title: 'hello',
        description: 'world',
        windowDays: 30,
    })
})

Deno.test('getSearchParams()', () => {
    const descriptor = {
        title: String,
        description: String,
        windowDays: Number,
    }

    const url = new URL('https://example.com')
    const outUrl = setSearchParams(descriptor, url, {
        title: 'hello',
        description: 'world',
        windowDays: 30,
    })
    assertEquals(outUrl.toString(), 'https://example.com/?title=hello&description=world&windowDays=30')
})