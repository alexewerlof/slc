import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { addUTM } from './utm.js'

describe(addUTM.name, () => {
    it('adds normalized UTM query parameters', () => {
        const url = new URL('https://example.com/')
        assert.strictEqual(addUTM(url).toString(), 'https://example.com/')
        assert.strictEqual(
            addUTM(url, {
                source: 'newsletter',
                medium: 'email',
            }).toString(),
            'https://example.com/?utm_source=newsletter&utm_medium=email',
        )
        assert.strictEqual(
            addUTM(url, {
                source: 'newsletter',
                medium: 'EMail',
                campaign: 'spring_sale',
                term: 'Spring',
                content: 'header_link',
            }).toString(),
            'https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale&utm_term=spring&utm_content=header_link',
        )
    })
})
