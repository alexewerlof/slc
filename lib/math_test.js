import { assertEquals, assertThrows, test } from '../vendor/deno.js'
import { clamp, percent, percentToRatio, range, rmItemGetNext, toFixed } from './math.js'

test('percent()', () => {
    assertEquals(percent(50, 200), 100)
    assertEquals(percent(25, 80), 20)
    assertEquals(percent(75, 120), 90)
    assertEquals(percent(-50, 200), -100)
})

test('percent throws error for invalid input', () => {
    assertThrows(() => percent('50', 200))
    assertThrows(() => percent(50, '200'))
    assertThrows(() => percent(NaN, 200))
})

test('percentToRatio()', () => {
    assertEquals(percentToRatio(50), 0.5)
    assertEquals(percentToRatio(25), 0.25)
    assertEquals(percentToRatio(75), 0.75)
})

test('toFixed()', () => {
    assertEquals(toFixed(1.2345), 1.234)
    assertEquals(toFixed(3.14159, 2), 3.14)
    assertEquals(toFixed(0.123456789, 6), 0.123457)
    assertEquals(toFixed(99.999), 99.999)
    assertEquals(toFixed(0.001), 0.001)
})

test('clamp()', () => {
    assertEquals(clamp(5, 0, 10), 5)
    assertEquals(clamp(15, 0, 10), 10)
    assertEquals(clamp(-5, 0, 10), 0)
})

test('range()', () => {
    assertEquals(range([1, 2, 3, 4, 5]), [1, 5])
    assertEquals(range([0, 0, 0, 0, 0]), [0, 0])
    assertEquals(range([-1, -2, -3, -4, -5]), [-5, -1])
    assertEquals(range([1]), [1, 1])
    assertThrows(() => range(true), TypeError)
    assertThrows(() => range([]), RangeError)
    assertThrows(() => range(['a', 'b', 'c']), TypeError)
})

test('rmItemGetNext()', () => {
    const a = { a: 11 }
    const b = { b: 22 }
    const c = { c: 33 }
    const d = { d: 44 }
    const e = { e: 55 }

    const arr0 = []
    assertEquals(rmItemGetNext([...arr0], undefined), undefined)
    assertEquals(rmItemGetNext([...arr0], a), undefined)
    assertEquals(rmItemGetNext([...arr0], b), undefined)

    const arr1 = [a]
    assertEquals(rmItemGetNext([...arr1], a), undefined)
    assertEquals(rmItemGetNext([...arr1], b), a)
    assertEquals(rmItemGetNext([...arr1], undefined), a)

    const arr2 = [a, b]
    assertEquals(rmItemGetNext([...arr2], a), b)
    assertEquals(rmItemGetNext([...arr2], b), a)
    assertEquals(rmItemGetNext([...arr2], c), a)
    assertEquals(rmItemGetNext([...arr2], undefined), a)

    const arr3 = [a, b, c]
    assertEquals(rmItemGetNext([...arr3], a), b)
    assertEquals(rmItemGetNext([...arr3], b), c)
    assertEquals(rmItemGetNext([...arr3], c), b)
    assertEquals(rmItemGetNext([...arr3], d), a)
    assertEquals(rmItemGetNext([...arr3], undefined), a)

    const arr4 = [a, b, c, d]
    assertEquals(rmItemGetNext([...arr4], a), b)
    assertEquals(rmItemGetNext([...arr4], b), c)
    assertEquals(rmItemGetNext([...arr4], c), d)
    assertEquals(rmItemGetNext([...arr4], d), c)
    assertEquals(rmItemGetNext([...arr4], e), a)
    assertEquals(rmItemGetNext([...arr4], undefined), a)

    assertThrows(() => rmItemGetNext(undefined, a), TypeError)
    assertThrows(() => rmItemGetNext(a, a), TypeError)
})
