import { assert, assertFalse } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { caseInsensitiveSearch } from './search.js'

Deno.test('caseInsensitiveSearch()', () => {
    assert(caseInsensitiveSearch('', 'hello'))
    assert(caseInsensitiveSearch(' h ', 'hello'))
    assert(caseInsensitiveSearch('hello', 'they said hello world'))
    assert(caseInsensitiveSearch('HELLO', 'they said hello world'))
    assert(caseInsensitiveSearch('hello', 'they said HELLO WORLD'))
    assertFalse(caseInsensitiveSearch('x', 'hello'))
    assertFalse(caseInsensitiveSearch('X', 'hello'))
})