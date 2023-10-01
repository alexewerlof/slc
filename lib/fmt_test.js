import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { numberSep } from "./fmt.js"

Deno.test('numberSep()', () => {
    assertEquals(numberSep(10), '10')
    assertEquals(numberSep(1000), (new Intl.NumberFormat()).format('1000'))
})