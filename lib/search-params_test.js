import { assertEquals, assertThrows, test } from '../vendor/deno.js'
import { getSearchParams, parseParamValue, setSearchParams } from './search-params.js'

test('parseParamValue()', () => {
    assertEquals(parseParamValue(String, 'hello'), 'hello')
    assertEquals(parseParamValue(String, undefined), undefined)
    assertEquals(parseParamValue(Number, '42'), 42)
    assertEquals(parseParamValue(Number, undefined), undefined)
    assertEquals(parseParamValue(Number, 'foo'), undefined)
    assertEquals(parseParamValue(Number, ''), undefined)
    assertEquals(parseParamValue(Number, '   '), undefined)
    assertThrows(() => parseParamValue(Boolean, 'true'))
    assertEquals(parseParamValue(Object, '{"foo":"bar"}'), { foo: 'bar' })
    assertThrows(() => parseParamValue(undefined, 'foo'), TypeError)
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
        expectedTotalEvents: Number,
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
