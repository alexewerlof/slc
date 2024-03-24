import {
  assert,
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
  assert(isObj({ key: 'value' }))
})

Deno.test('isStr()', () => {
  assertEquals(isStr(), false)
  assertEquals(isStr(1), false)
  assertEquals(isStr({}), false)
  assertEquals(isStr(false), false)
  assertEquals(isStr(true), false)
  assertEquals(isStr(undefined), false)
  assert(isStr('false'))
  assert(isStr(''))
  assert(isStr(' '))
  assert(isStr('x'))
  assert(isStr(' x'))
  assert(isStr('x '))
  assert(isStr('xy z'))
})

Deno.test('isNum()', () => {
  assert(isNum(123))
  assert(isNum(-123))
  assert(isNum(0))
  assert(isNum(1.23))
  assertEquals(isNum('123'), false)
  assertEquals(isNum([123]), false)
  assertEquals(isNum({ num: 123 }), false)
  assertEquals(isNum(null), false)
  assertEquals(isNum(undefined), false)
  assertEquals(isNum(NaN), false)
})

Deno.test('inRange()', () => {
  assert(inRange(5, 1, 10))
  assert(inRange(1, 1, 10))
  assert(inRange(10, 1, 10))
  assertEquals(inRange(0, 1, 10), false)
  assertEquals(inRange(11, 1, 10), false)
  assertEquals(inRange('5', 1, 10), false)
  assertEquals(inRange(undefined, 1, 2), false)
  assertThrows(() => inRange(5, '1', 10), TypeError)
  assertThrows(() => inRange(5, 1, '10'), TypeError)
  assertThrows(() => inRange(5, 10, 1), RangeError)
})

Deno.test('inRangePosInt()', () => {
  assert(inRangePosInt(5, 1, 10))
  assert(inRangePosInt(1, 1, 10))
  assert(inRangePosInt(10, 1, 10))
  assertEquals(inRangePosInt(0, 1, 10), false)
  assertEquals(inRangePosInt(11, 1, 10), false)
  assertEquals(inRangePosInt(1.5, 1, 10), false)
  assertEquals(inRangePosInt(-1, 1, 10), false)
  assertThrows(() => inRangePosInt(5, '1', 10), TypeError)
  assertThrows(() => inRangePosInt(5, 1, '10'), TypeError)
  assertThrows(() => inRangePosInt(5, 10, 1), RangeError)
})
