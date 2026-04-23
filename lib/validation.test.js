import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isOsloName, isUrlStr } from './validation.js'

describe(isOsloName.name, () => {
    it('validates oslo names', () => {
        assert.strictEqual(isOsloName('service-name'), true)
        assert.strictEqual(isOsloName('service_name'), false)
        assert.strictEqual(isOsloName('a'), true)
        assert.strictEqual(isOsloName('A'), false)
        assert.strictEqual(isOsloName('!1'), false)
        assert.strictEqual(isOsloName(' a'), false)
    })
})

describe(isUrlStr.name, () => {
    it('validates URL strings', () => {
        assert.strictEqual(isUrlStr('https://alexewerlof.com'), true)
        assert.strictEqual(isUrlStr('http://alexewerlof.com'), true)
        assert.strictEqual(isUrlStr('alexewerlof.com'), false)
        assert.strictEqual(isUrlStr(''), false)
        assert.strictEqual(isUrlStr(undefined), false)
        assert.strictEqual(isUrlStr(new URL('https://alexewerlof.com')), false)
    })
})
