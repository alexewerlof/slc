import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.216.0/assert/mod.ts"
import { isObj, isStr, isNum, inRange, inRangePosInt } from "./validation.js"

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

Deno.test('inRange()', () => {
  assertEquals(inRange(5, 1, 10), true)
  assertEquals(inRange(1, 1, 10), true)
  assertEquals(inRange(10, 1, 10), true)
  assertEquals(inRange(0, 1, 10), false)
  assertEquals(inRange(11, 1, 10), false)
  assertEquals(inRange('5', 1, 10), false)
  assertThrows(() => inRange(5, '1', 10), TypeError)
  assertThrows(() => inRange(5, 1, '10'), TypeError)
  assertThrows(() => inRange(5, 10, 1), RangeError)
})

Deno.test('inRangePosInt()', () => {
  assertEquals(inRangePosInt(5, 1, 10), true)
  assertEquals(inRangePosInt(1, 1, 10), true)
  assertEquals(inRangePosInt(10, 1, 10), true)
  assertEquals(inRangePosInt(0, 1, 10), false)
  assertEquals(inRangePosInt(11, 1, 10), false)
  assertEquals(inRangePosInt(1.5, 1, 10), false)
  assertEquals(inRangePosInt(-1, 1, 10), false)
  assertThrows(() => inRangePosInt(5, '1', 10), TypeError)
  assertThrows(() => inRangePosInt(5, 1, '10'), TypeError)
  assertThrows(() => inRangePosInt(5, 10, 1), RangeError)
})
