import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getSearchParams, parseParamValue, setSearchParams } from './search-params.js'

describe(parseParamValue.name, () => {
    it('parses supported parameter values and validates input', () => {
        assert.strictEqual(parseParamValue(String, 'hello'), 'hello')
        assert.strictEqual(parseParamValue(String, undefined), undefined)
        assert.strictEqual(parseParamValue(Number, '42'), 42)
        assert.strictEqual(parseParamValue(Number, undefined), undefined)
        assert.strictEqual(parseParamValue(Number, 'foo'), undefined)
        assert.strictEqual(parseParamValue(Number, ''), undefined)
        assert.strictEqual(parseParamValue(Number, '   '), undefined)
        assert.throws(() => parseParamValue(Boolean, 'true'))
        assert.deepStrictEqual(parseParamValue(Object, '{"foo":"bar"}'), { foo: 'bar' })
        assert.throws(() => parseParamValue(undefined, 'foo'), TypeError)
    })
})

describe(getSearchParams.name, () => {
    it('extracts matching search params by descriptor', () => {
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
        assert.deepStrictEqual(params, {
            title: 'hello',
            description: 'world',
            windowDays: 30,
        })
    })
})

describe(setSearchParams.name, () => {
    it('writes descriptor values to the URL search params', () => {
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
        assert.strictEqual(outUrl.toString(), 'https://example.com/?title=hello&description=world&windowDays=30')
    })
})
