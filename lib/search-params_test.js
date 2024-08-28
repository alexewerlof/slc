import { test, assertEquals, assertThrows } from "../vendor/deno.js";
import { convertParam, getSearchParams, setSearchParams } from './search-params.js'

test('convertParam()', () => {
    assertEquals(convertParam(String, 'hello'), 'hello')
    assertEquals(convertParam(String, undefined), undefined)
    assertEquals(convertParam(Number, '42'), 42)
    assertEquals(convertParam(Number, undefined), undefined)
    assertEquals(convertParam(Number, 'foo'), undefined)
    assertEquals(convertParam(Number, ''), undefined)
    assertEquals(convertParam(Number, '   '), undefined)
    assertThrows(() => convertParam(Boolean, 'true'))
})

test('getSearchParams()', () => {
    const descriptor = {
        title: String,
        description: String,
        unit: Number,
        metricName: String,
        eventUnit: String,
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

test('getSearchParams()', () => {
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