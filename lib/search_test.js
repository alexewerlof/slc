import { test, assertEquals } from "../vendor/deno.js";
import { caseInsensitiveSearch, unique, tokenize, templateTokens } from './search.js'

test('caseInsensitiveSearch()', () => {
    assertEquals(caseInsensitiveSearch('', 'hello'), true)
    assertEquals(caseInsensitiveSearch(' h ', 'hello'), true)
    assertEquals(caseInsensitiveSearch('hello', 'they said hello world'), true)
    assertEquals(caseInsensitiveSearch('HELLO', 'they said hello world'), true)
    assertEquals(caseInsensitiveSearch('hello', 'they said HELLO WORLD'), true)
    assertEquals(caseInsensitiveSearch('x', 'hello'), false)
    assertEquals(caseInsensitiveSearch('X', 'hello'), false)
})

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
        tags: ['api', 'front end', 'web']
    }
    assertEquals(templateTokens(template), ['hello', 'world', 'web', 'api', 'front end'])
})