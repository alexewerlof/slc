import { assertEquals, test } from '../vendor/deno.js'
import { templateTokens, tokenize, unique } from './search.js'

test('unique()', () => {
    assertEquals(unique([]), [])
    assertEquals(unique([1, 2, 3]), [1, 2, 3])
    assertEquals(unique([1, 2, 3, 1, 2, 3]), [1, 2, 3])
    assertEquals(unique([1, 2, 3, 1, 2, 3, 1, 2, 3]), [1, 2, 3])
})

test('tokenize()', () => {
    assertEquals(tokenize('hello'), ['hello'])
    assertEquals(tokenize('hello world'), ['hello', 'world'])
    assertEquals(tokenize('hello, world'), ['hello', 'world'])
    assertEquals(tokenize('  hello,  P99 world 1 55!  '), ['hello', 'world'])
})

test('templateTokens()', () => {
    const template = {
        title: 'hello',
        description: 'world web',
        tags: ['api', 'front end', 'web'],
    }
    assertEquals(templateTokens(template), ['hello', 'world', 'web', 'api', 'front end'])
})
