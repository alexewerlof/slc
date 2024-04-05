import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { templatePath } from './fetch-template.js'

Deno.test('templatePath()', () => {
    const importMetaUrl = 'http://slc.alexewerlof.com/components/burn.js'
    assertEquals(templatePath(importMetaUrl), 'http://slc.alexewerlof.com/components/burn.html')
})