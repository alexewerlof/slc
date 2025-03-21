import { assertEquals, test } from '../vendor/deno.js'
import { addUTM } from './utm.js'

test('addUTM()', () => {
    const url = new URL('https://example.com/')
    assertEquals(addUTM(url).toString(), 'https://example.com/')
    assertEquals(
        addUTM(url, {
            source: 'newsletter',
            medium: 'email',
        }).toString(),
        'https://example.com/?utm_source=newsletter&utm_medium=email',
    )
    assertEquals(
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
