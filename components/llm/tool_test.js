import test from 'node:test'
import assert from 'node:assert/strict'
import { parseParamShorthand } from './tool.js'

test.describe('parseParamShorthand()', () => {
    test.it('should parse a required parameter correctly', () => {
        const paramShorthand = 'displayName: string*'
        const expected = { name: 'displayName', type: 'string', required: true }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should parse an optional parameter correctly', () => {
        const paramShorthand = 'description: string'
        const expected = { name: 'description', type: 'string', required: false }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should handle leading/trailing whitespace around name', () => {
        const paramShorthand = '  paramName  : number*'
        const expected = { name: 'paramName', type: 'number', required: true }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should handle leading/trailing whitespace around type', () => {
        const paramShorthand = 'paramName:  boolean  '
        const expected = { name: 'paramName', type: 'boolean', required: false }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should handle whitespace before asterisk', () => {
        const paramShorthand = 'paramName: integer *'
        const expected = { name: 'paramName', type: 'integer', required: true }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should handle parameter names with numbers', () => {
        const paramShorthand = 'param1: string'
        const expected = { name: 'param1', type: 'string', required: false }
        assert.deepStrictEqual(parseParamShorthand(paramShorthand), expected)
    })

    test.it('should throw an error if paramShorthand is not a string', () => {
        assert.throws(
            () => parseParamShorthand(123),
            TypeError,
            'Expected paramShorthand to be a string. Got 123',
        )
        assert.throws(
            () => parseParamShorthand(null),
            TypeError,
            'Expected paramShorthand to be a string. Got null',
        )
        assert.throws(
            () => parseParamShorthand(undefined),
            TypeError,
            'Expected paramShorthand to be a string. Got undefined',
        )
        assert.throws(
            () => parseParamShorthand({}),
            TypeError,
            'Expected paramShorthand to be a string. Got [object Object]',
        )
    })

    test.it('should throw an error for invalid format (missing colon)', () => {
        const paramShorthand = 'displayName string*'
        assert.throws(
            () => parseParamShorthand(paramShorthand),
            SyntaxError,
            `Invalid parameter description format: ${paramShorthand}`,
        )
    })

    test.it('should throw an error for invalid format (too many colons)', () => {
        const paramShorthand = 'displayName: string: extra*'
        assert.throws(
            () => parseParamShorthand(paramShorthand),
            SyntaxError,
            `Invalid paramShorthand format: ${paramShorthand}`,
        )
    })

    test.it('should throw an error for empty string input', () => {
        const paramShorthand = ''
        assert.throws(
            () => parseParamShorthand(paramShorthand),
            SyntaxError,
            `Invalid parameter description format: ${paramShorthand}`,
        )
    })

    test.it('should throw for empty name', () => {
        const paramShorthand = ':string*'
        assert.throws(
            () => parseParamShorthand(paramShorthand),
            SyntaxError,
            'Handles empty name before colon',
        )
    })

    test.it('should throw for empty type', () => {
        const paramShorthand = 'paramName:*'
        assert.throws(
            () => parseParamShorthand(paramShorthand),
            SyntaxError,
            'Handles empty type after colon',
        )
    })
})
