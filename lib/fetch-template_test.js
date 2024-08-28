import { test, assertEquals, assertThrows } from "../vendor/deno.js";
import { _getFileNameRoot } from './fetch-template.js'

test('_getFileNameRoot()', () => {
    const importMetaUrl = 'http://slc.alexewerlof.com/components/burn.js'
    assertEquals(_getFileNameRoot(importMetaUrl), 'http://slc.alexewerlof.com/components/burn')
    assertThrows(() => _getFileNameRoot('http://slc.alexewerlof.com/components/burn'), Error, 'importMetaUrl must end with ".js"')
})
