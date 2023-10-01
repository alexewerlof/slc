import { assertEquals } from "https://deno.land/std/testing/asserts.ts"
import { numL10n } from "./fmt.js"

Deno.test('numL10n()', () => {
    assertEquals(numL10n(10), '10')
    assertEquals(numL10n(1000), (new Intl.NumberFormat()).format('1000'))
})