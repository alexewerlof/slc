import { assertEquals, assertThrows, test } from '../vendor/deno.js'
import {
    hasOProp,
    hasProp,
    inRange,
    inRangePosInt,
    isArr,
    isArrIdx,
    isInArr,
    isInstance,
    isInt,
    isNum,
    isObj,
    isOsloName,
    isSameArr,
    isStr,
    isStrLen,
} from './validation.js'

test('isObj()', () => {
    assertEquals(isObj(), false)
    assertEquals(isObj(1), false)
    assertEquals(isObj({}), true)
    assertEquals(isObj(false), false)
    assertEquals(isObj([]), false)
    assertEquals(isObj('test string'), false)
    assertEquals(isObj({ key: 'value' }), true)
})

test('hasProp()', () => {
    assertEquals(hasProp({ a: 'b' }, 'a'), true)
    assertEquals(hasProp({ c: 'd' }, 'a'), false)
    assertEquals(hasProp(undefined, 'a'), false)
    assertEquals(hasProp(1, 'a'), false)
    assertEquals(hasProp({ a: 'b' }, ''), false)
    assertEquals(hasProp({}, 'a'), false)
    assertEquals(hasProp({ a: 'b', c: 'd' }, 'c'), true)
    class A {
        b = 'c'
    }
    const a = new A()
    assertEquals(hasProp(a, 'b'), true)
    class B extends A {}
    const b = new B()
    assertEquals(hasProp(b, 'b'), true)
    const p = { z: 'x' }
    const o = Object.create(p)
    assertEquals(hasProp(o, 'z'), true)
})

test('hasOProp()', () => {
    assertEquals(hasOProp({ a: 'b' }, 'a'), true)
    assertEquals(hasOProp({ c: 'd' }, 'a'), false)
    assertEquals(hasOProp(undefined, 'a'), false)
    assertEquals(hasOProp(1, 'a'), false)
    assertEquals(hasOProp({ a: 'b' }, ''), false)
    assertEquals(hasOProp({}, 'a'), false)
    assertEquals(hasOProp({ a: 'b', c: 'd' }, 'c'), true)
    class A {
        b = 'c'
    }
    const a = new A()
    assertEquals(hasOProp(a, 'b'), true)
    class B extends A {}
    const b = new B()
    assertEquals(hasOProp(b, 'b'), true)
    const p = { z: 'x' }
    const o = Object.create(p)
    assertEquals(hasOProp(o, 'z'), false)
})

test('isStr()', () => {
    assertEquals(isStr(), false)
    assertEquals(isStr(1), false)
    assertEquals(isStr({}), false)
    assertEquals(isStr(false), false)
    assertEquals(isStr(true), false)
    assertEquals(isStr(undefined), false)
    assertEquals(isStr('false'), true)
    assertEquals(isStr(''), true)
    assertEquals(isStr(' '), true)
    assertEquals(isStr('x'), true)
    assertEquals(isStr(' x'), true)
    assertEquals(isStr('x '), true)
    assertEquals(isStr('xy z'), true)
})

test('isStrLen()', () => {
    assertEquals(isStrLen('test', 1, 10), true)
    assertEquals(isStrLen('test', 1, 4), true)
    assertEquals(isStrLen('test', 1, 3), false)
    assertEquals(isStrLen('test', 5, 10), false)
    assertEquals(isStrLen('test', 2), true)
    assertEquals(isStrLen('test', 4), true)
    assertEquals(isStrLen('test', 5), false)
    assertThrows(() => isStrLen('test', '1', 10), TypeError)
    assertThrows(() => isStrLen('test', 1, '10'), TypeError)
    assertThrows(() => isStrLen('test', 10, 1), RangeError)
})

test('isNum()', () => {
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

test('isInt()', () => {
    assertEquals(isInt(1), true)
    assertEquals(isInt(0), true)
    assertEquals(isInt(-1), true)
    assertEquals(isInt(1.1), false)
    assertEquals(isInt('1'), false)
    assertEquals(isInt(NaN), false)
})

test('inRange()', () => {
    assertEquals(inRange(5, 1, 10), true)
    assertEquals(inRange(1, 1, 10), true)
    assertEquals(inRange(10, 1, 10), true)
    assertEquals(inRange(0, 1, 10), false)
    assertEquals(inRange(11, 1, 10), false)
    assertEquals(inRange('5', 1, 10), false)
    assertEquals(inRange(undefined, 1, 2), false)
    assertThrows(() => inRange(5, '1', 10), TypeError)
    assertThrows(() => inRange(5, 1, '10'), TypeError)
    assertThrows(() => inRange(5, 10, 1), RangeError)
})

test('inRangePosInt()', () => {
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

test('isInstance()', () => {
    class Test {}
    const test = new Test()
    assertEquals(isInstance(test, Test), true)
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

test('isArr()', () => {
    assertEquals(isArr([]), true)
    assertEquals(isArr([1, 2, 3]), true)
    assertEquals(isArr({}), false)
    assertEquals(isArr(undefined), false)
    const o = {
        0: 'hello',
        1: 'world',
    }
    assertEquals(isArr(o), false)
})

test('isArrIdx()', () => {
    const arr = [1, 2, 3]
    assertEquals(isArrIdx(arr, 0), true)
    assertEquals(isArrIdx(arr, 1), true)
    assertEquals(isArrIdx(arr, 2), true)
    assertEquals(isArrIdx(arr, 3), false)
    assertEquals(isArrIdx(undefined, 0), false)
    assertEquals(isArrIdx([], 0), false)
})

test('isInArr()', () => {
    assertEquals(isInArr(1, [1, 2, 3]), true)
    assertEquals(isInArr(4, [1, 2, 3]), false)
    assertEquals(isInArr('alex', ['alex', 'bob', 'cecilia']), true)
    assertEquals(isInArr('dany', ['alex', 'bob', 'cecilia']), false)
    assertThrows(() => isInArr('alex'), TypeError)
    assertThrows(() => isInArr('alex', 1), TypeError)
})

test('isSameArr()', () => {
    const arr = [4, 5, 6]
    assertEquals(isSameArr(arr, arr), true)
    assertEquals(isSameArr([1, 2, 3], [1, 2, 3]), true)
    assertEquals(isSameArr([7, 8, 9], [7, 8]), false)
    assertEquals(isSameArr([7, 8, 9], [7, 8, 9, 10]), false)
    assertThrows(() => isSameArr(undefined, []), TypeError)
    assertThrows(() => isSameArr([]), TypeError)
})
