import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
    hasOProp,
    hasProp,
    inRange,
    inRangeInt,
    isArr,
    isArrIdx,
    isBool,
    isInArr,
    isInstance,
    isInt,
    isNum,
    isObj,
    isOsloName,
    isSameArr,
    isStr,
    isStrLen,
    isUrlStr,
} from './validation.js'

describe(isObj.name, () => {
    it('validates plain object inputs', () => {
        assert.strictEqual(isObj(), false)
        assert.strictEqual(isObj(1), false)
        assert.strictEqual(isObj({}), true)
        assert.strictEqual(isObj(false), false)
        assert.strictEqual(isObj([]), false)
        assert.strictEqual(isObj('test string'), false)
        assert.strictEqual(isObj({ key: 'value' }), true)
    })
})

describe(hasProp.name, () => {
    it('checks inherited or own properties', () => {
        assert.strictEqual(hasProp({ a: 'b' }, 'a'), true)
        assert.strictEqual(hasProp({ c: 'd' }, 'a'), false)
        assert.strictEqual(hasProp(undefined, 'a'), false)
        assert.strictEqual(hasProp(1, 'a'), false)
        assert.strictEqual(hasProp({ a: 'b' }, ''), false)
        assert.strictEqual(hasProp({}, 'a'), false)
        assert.strictEqual(hasProp({ a: 'b', c: 'd' }, 'c'), true)
        class A {
            b = 'c'
        }
        const a = new A()
        assert.strictEqual(hasProp(a, 'b'), true)
        class B extends A {}
        const b = new B()
        assert.strictEqual(hasProp(b, 'b'), true)
        const p = { z: 'x' }
        const o = Object.create(p)
        assert.strictEqual(hasProp(o, 'z'), true)
    })
})

describe(hasOProp.name, () => {
    it('checks own properties only', () => {
        assert.strictEqual(hasOProp({ a: 'b' }, 'a'), true)
        assert.strictEqual(hasOProp({ c: 'd' }, 'a'), false)
        assert.strictEqual(hasOProp(undefined, 'a'), false)
        assert.strictEqual(hasOProp(1, 'a'), false)
        assert.strictEqual(hasOProp({ a: 'b' }, ''), false)
        assert.strictEqual(hasOProp({}, 'a'), false)
        assert.strictEqual(hasOProp({ a: 'b', c: 'd' }, 'c'), true)
        class A {
            b = 'c'
        }
        const a = new A()
        assert.strictEqual(hasOProp(a, 'b'), true)
        class B extends A {}
        const b = new B()
        assert.strictEqual(hasOProp(b, 'b'), true)
        const p = { z: 'x' }
        const o = Object.create(p)
        assert.strictEqual(hasOProp(o, 'z'), false)
    })
})

describe(isStr.name, () => {
    it('validates string values', () => {
        assert.strictEqual(isStr(), false)
        assert.strictEqual(isStr(1), false)
        assert.strictEqual(isStr({}), false)
        assert.strictEqual(isStr(false), false)
        assert.strictEqual(isStr(true), false)
        assert.strictEqual(isStr(undefined), false)
        assert.strictEqual(isStr('false'), true)
        assert.strictEqual(isStr(''), true)
        assert.strictEqual(isStr(' '), true)
        assert.strictEqual(isStr('x'), true)
        assert.strictEqual(isStr(' x'), true)
        assert.strictEqual(isStr('x '), true)
        assert.strictEqual(isStr('xy z'), true)
    })
})

describe(isStrLen.name, () => {
    it('validates string lengths and argument ranges', () => {
        assert.strictEqual(isStrLen('test', 1, 10), true)
        assert.strictEqual(isStrLen('test', 1, 4), true)
        assert.strictEqual(isStrLen('test', 1, 3), false)
        assert.strictEqual(isStrLen('test', 5, 10), false)
        assert.strictEqual(isStrLen('test', 2), true)
        assert.strictEqual(isStrLen('test', 4), true)
        assert.strictEqual(isStrLen('test', 5), false)
        assert.throws(() => isStrLen('test', '1', 10), TypeError)
        assert.throws(() => isStrLen('test', 1, '10'), TypeError)
        assert.throws(() => isStrLen('test', 10, 1), RangeError)
    })
})

describe(isBool.name, () => {
    it('validates booleans', () => {
        assert.strictEqual(isBool(true), true)
        assert.strictEqual(isBool(false), true)
        assert.strictEqual(isBool(1), false)
        assert.strictEqual(isBool('true'), false)
        assert.strictEqual(isBool('false'), false)
        assert.strictEqual(isBool(''), false)
        assert.strictEqual(isBool(undefined), false)
        assert.strictEqual(isBool(null), false)
    })
})

describe(isNum.name, () => {
    it('validates numeric values', () => {
        assert.strictEqual(isNum(123), true)
        assert.strictEqual(isNum(-123), true)
        assert.strictEqual(isNum(0), true)
        assert.strictEqual(isNum(1.23), true)
        assert.strictEqual(isNum('123'), false)
        assert.strictEqual(isNum([123]), false)
        assert.strictEqual(isNum({ num: 123 }), false)
        assert.strictEqual(isNum(null), false)
        assert.strictEqual(isNum(undefined), false)
        assert.strictEqual(isNum(NaN), false)
    })
})

describe(isInt.name, () => {
    it('validates integers', () => {
        assert.strictEqual(isInt(1), true)
        assert.strictEqual(isInt(0), true)
        assert.strictEqual(isInt(-1), true)
        assert.strictEqual(isInt(1.1), false)
        assert.strictEqual(isInt('1'), false)
        assert.strictEqual(isInt(NaN), false)
    })
})

describe(inRange.name, () => {
    it('validates values within numeric ranges', () => {
        assert.strictEqual(inRange(5, 1, 10), true)
        assert.strictEqual(inRange(1, 1, 10), true)
        assert.strictEqual(inRange(10, 1, 10), true)
        assert.strictEqual(inRange(0, 1, 10), false)
        assert.strictEqual(inRange(11, 1, 10), false)
        assert.strictEqual(inRange('5', 1, 10), false)
        assert.strictEqual(inRange(undefined, 1, 2), false)
        assert.throws(() => inRange(5, '1', 10), TypeError)
        assert.throws(() => inRange(5, 1, '10'), TypeError)
        assert.throws(() => inRange(5, 10, 1), RangeError)
    })
})

describe(inRangeInt.name, () => {
    it('validates integer values within ranges', () => {
        assert.strictEqual(inRangeInt(5, 1, 10), true)
        assert.strictEqual(inRangeInt(1, 1, 10), true)
        assert.strictEqual(inRangeInt(10, 1, 10), true)
        assert.strictEqual(inRangeInt(0, 1, 10), false)
        assert.strictEqual(inRangeInt(11, 1, 10), false)
        assert.strictEqual(inRangeInt(1.5, 1, 10), false)
        assert.strictEqual(inRangeInt(-1, 1, 10), false)
        assert.throws(() => inRangeInt(5, '1', 10), TypeError)
        assert.throws(() => inRangeInt(5, 1, '10'), TypeError)
        assert.throws(() => inRangeInt(5, 10, 1), RangeError)
    })
})

describe(isInstance.name, () => {
    it('validates explicit instances', () => {
        class Test {}
        const test = new Test()
        assert.strictEqual(isInstance(test, Test), true)
        assert.strictEqual(isInstance(test, Object), false)
        assert.strictEqual(isInstance({}, Object), true)
        assert.strictEqual(isInstance('test', String), false)
        assert.strictEqual(isInstance(123, Number), false)
        assert.strictEqual(isInstance(true, Boolean), false)
        assert.strictEqual(isInstance(null, Object), false)
        assert.strictEqual(isInstance(undefined, Object), false)
    })
})

describe(isOsloName.name, () => {
    it('validates oslo names', () => {
        assert.strictEqual(isOsloName('service-name'), true)
        assert.strictEqual(isOsloName('service_name'), false)
        assert.strictEqual(isOsloName('a'), true)
        assert.strictEqual(isOsloName('A'), false)
        assert.strictEqual(isOsloName('!1'), false)
        assert.strictEqual(isOsloName(' a'), false)
    })
})

describe(isArr.name, () => {
    it('validates arrays', () => {
        assert.strictEqual(isArr([]), true)
        assert.strictEqual(isArr([1, 2, 3]), true)
        assert.strictEqual(isArr({}), false)
        assert.strictEqual(isArr(undefined), false)
        const o = {
            0: 'hello',
            1: 'world',
        }
        assert.strictEqual(isArr(o), false)
    })
})

describe(isArrIdx.name, () => {
    it('validates array indices', () => {
        const arr = [1, 2, 3]
        assert.strictEqual(isArrIdx(arr, 0), true)
        assert.strictEqual(isArrIdx(arr, 1), true)
        assert.strictEqual(isArrIdx(arr, 2), true)
        assert.strictEqual(isArrIdx(arr, 3), false)
        assert.strictEqual(isArrIdx(undefined, 0), false)
        assert.strictEqual(isArrIdx([], 0), false)
    })
})

describe(isInArr.name, () => {
    it('checks value membership in arrays', () => {
        assert.strictEqual(isInArr(1, [1, 2, 3]), true)
        assert.strictEqual(isInArr(4, [1, 2, 3]), false)
        assert.strictEqual(isInArr('alex', ['alex', 'bob', 'cecilia']), true)
        assert.strictEqual(isInArr('dany', ['alex', 'bob', 'cecilia']), false)
        assert.throws(() => isInArr('alex'), TypeError)
        assert.throws(() => isInArr('alex', 1), TypeError)
    })
})

describe(isSameArr.name, () => {
    it('compares arrays for equality', () => {
        const arr = [4, 5, 6]
        assert.strictEqual(isSameArr(arr, arr), true)
        assert.strictEqual(isSameArr([1, 2, 3], [1, 2, 3]), true)
        assert.strictEqual(isSameArr([7, 8, 9], [7, 8]), false)
        assert.strictEqual(isSameArr([7, 8, 9], [7, 8, 9, 10]), false)
        assert.throws(() => isSameArr(undefined, []), TypeError)
        assert.throws(() => isSameArr([]), TypeError)
    })
})

describe(isUrlStr.name, () => {
    it('validates URL strings', () => {
        assert.strictEqual(isUrlStr('https://alexewerlof.com'), true)
        assert.strictEqual(isUrlStr('http://alexewerlof.com'), true)
        assert.strictEqual(isUrlStr('alexewerlof.com'), false)
        assert.strictEqual(isUrlStr(''), false)
        assert.strictEqual(isUrlStr(undefined), false)
        assert.strictEqual(isUrlStr(new URL('https://alexewerlof.com')), false)
    })
})
