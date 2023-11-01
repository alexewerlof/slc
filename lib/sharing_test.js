import { decodeState, encodeState } from './sharing.js'

Deno.test('encodeState()', () => {
    Deno.test('is the reverse of decodeState()', () => {
        const obj = { foo: 'bar' }
        const param = encodeState(obj)
        const result = decodeState(param)
        assertEquals(result, obj)
    })
})

Deno.test('decodeState()', () => {
    Deno.test('is the reverse of encodeState()', () => {
        const obj = { foo: 'bar' }
        const param = encodeState(obj)
        const result = decodeState(param)
        assertEquals(result, obj)
    })
})