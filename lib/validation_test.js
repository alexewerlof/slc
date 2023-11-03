import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts"
import { isObj, isStr, isNum, isBetween, isPIntBetween } from "./validation.js"

Deno.test('isObj()', () => {
  assertEquals(isObj(), false)
  assertEquals(isObj(1), false)
  assertEquals(isObj({}), true)
  assertEquals(isObj(false), false)
  assertEquals(isObj([]), false)
  assertEquals(isObj('test string'), false)
})

Deno.test('isStr()', () => {
  assertEquals(isStr(), false)
  assertEquals(isStr(1), false)
  assertEquals(isStr({}), false)
  assertEquals(isStr(false), false)
  assertEquals(isStr(true), false)
  assertEquals(isStr(''), true)
  assertEquals(isStr(' '), true)
  assertEquals(isStr('x'), true)
  assertEquals(isStr(' x'), true)
  assertEquals(isStr('x '), true)
  assertEquals(isStr('xy z'), true)
})

Deno.test('isNum()', () => {
  assertEquals(isNum(123), true)
  assertEquals(isNum(-123), true)
  assertEquals(isNum(0), true)
  assertEquals(isNum(1.23), true)
  assertEquals(isNum('123'), false)
  assertEquals(isNum([123]), false)
  assertEquals(isNum({ num: 123 }), false)
  assertEquals(isNum(null), false)
  assertEquals(isNum(undefined), false)
  assertEquals(isNum(NaN), false)
})

Deno.test('isBetween()', () => {
  assertEquals(isBetween(5, 1, 10), true)
  assertEquals(isBetween(1, 1, 10), true)
  assertEquals(isBetween(10, 1, 10), true)
  assertEquals(isBetween(0, 1, 10), false)
  assertEquals(isBetween(11, 1, 10), false)
  assertThrows(() => isBetween('5', 1, 10), TypeError)
  assertThrows(() => isBetween(5, '1', 10), TypeError)
  assertThrows(() => isBetween(5, 1, '10'), TypeError)
  assertThrows(() => isBetween(5, 10, 1), RangeError)
})

Deno.test('isPIntBetween()', () => {
  assertEquals(isPIntBetween(5, 1, 10), true)
  assertEquals(isPIntBetween(1, 1, 10), true)
  assertEquals(isPIntBetween(10, 1, 10), true)
  assertEquals(isPIntBetween(0, 1, 10), false)
  assertEquals(isPIntBetween(11, 1, 10), false)
  assertEquals(isPIntBetween(1.5, 1, 10), false)
  assertEquals(isPIntBetween(-1, 1, 10), false)
  assertThrows(() => isPIntBetween(5, '1', 10), TypeError)
  assertThrows(() => isPIntBetween(5, 1, '10'), TypeError)
  assertThrows(() => isPIntBetween(5, 10, 1), RangeError)
})
