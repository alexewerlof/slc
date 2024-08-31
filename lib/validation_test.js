import { test,  assert,  assertEquals,  assertThrows } from "../vendor/deno.js"
import { isObj, isStr, isNum, inRange, inRangePosInt, isInstance, isOsloName } from "./validation.js"

test('isObj()', () => {
  assertEquals(isObj(), false)
  assertEquals(isObj(1), false)
  assertEquals(isObj({}), true)
  assertEquals(isObj(false), false)
  assertEquals(isObj([]), false)
  assertEquals(isObj('test string'), false)
  assert(isObj({ key: 'value' }))
})

test('isStr()', () => {
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

test('isNum()', () => {
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

test('inRange()', () => {
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

test('inRangePosInt()', () => {
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

test('isInstance()', () => {
  class Test {}
  const test = new Test()
  assert(isInstance(test, Test))
  assertEquals(isInstance(test, Object), false)
  assertEquals(isInstance({}, Object), true)
  assertEquals(isInstance('test', String), false)
  assertEquals(isInstance(123, Number), false)
  assertEquals(isInstance(true, Boolean), false)
  assertEquals(isInstance(null, Object), false)
  assertEquals(isInstance(undefined, Object), false)
})

test('isOsloName()', () => {
  assertEquals(isOsloName('service-name'), true)
  assertEquals(isOsloName('service_name'), false)
  assertEquals(isOsloName('a'), true)
  assertEquals(isOsloName('A'), false)
  assertEquals(isOsloName('!1'), false)
  assertEquals(isOsloName(' a'), false)
})