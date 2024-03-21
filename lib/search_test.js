import { assert, assertFalse, assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { caseInsensitiveSearch, unique, tokenize, templateTokens } from './search.js'

Deno.test('caseInsensitiveSearch()', () => {
    assert(caseInsensitiveSearch('', 'hello'))
    assert(caseInsensitiveSearch(' h ', 'hello'))
    assert(caseInsensitiveSearch('hello', 'they said hello world'))
    assert(caseInsensitiveSearch('HELLO', 'they said hello world'))
    assert(caseInsensitiveSearch('hello', 'they said HELLO WORLD'))
    assertFalse(caseInsensitiveSearch('x', 'hello'))
    assertFalse(caseInsensitiveSearch('X', 'hello'))
})

Deno.test('unique()', () => {
    assertEquals(unique([]), [])
    assertEquals(unique([1, 2, 3]), [1, 2, 3])
    assertEquals(unique([1, 2, 3, 1, 2, 3]), [1, 2, 3])
    assertEquals(unique([1, 2, 3, 1, 2, 3, 1, 2, 3]), [1, 2, 3])
})

Deno.test('tokenize()', () => {
    assertEquals(tokenize('hello'), ['hello'])
    assertEquals(tokenize('hello world'), ['hello', 'world'])
    assertEquals(tokenize('hello, world'), ['hello', 'world'])
    assertEquals(tokenize('  hello,  P99 world 1 55!  '), ['hello', 'world'])
})

Deno.test('templateTokens()', () => {
    const template = {
        title: 'hello',
        description: 'world web',
        tags: ['api', 'front end', 'web']
    }
    assertEquals(templateTokens(template), ['hello', 'world', 'web', 'api', 'front end'])
})