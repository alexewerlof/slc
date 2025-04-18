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
