import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { _getFileNameRoot } from './fetch-template.js'

Deno.test('_getFileNameRoot()', () => {
    const importMetaUrl = 'http://slc.alexewerlof.com/components/burn.js'
    assertEquals(_getFileNameRoot(importMetaUrl), 'http://slc.alexewerlof.com/components/burn')
    assertThrows(() => _getFileNameRoot('http://slc.alexewerlof.com/components/burn'), Error, 'importMetaUrl must end with ".js"')
})
