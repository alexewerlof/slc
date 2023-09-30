import { validateParams } from "./lib/validation.js"
import { default as sliExamples } from './examples.js'

Deno.test('all examples are valid', () => {
    for (const example of sliExamples) {
        validateParams(example)
    }
})