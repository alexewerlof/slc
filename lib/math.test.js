import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { clamp, percent, percentToRatio, range, toFixed } from './math.js'

describe(percent.name, () => {
    it('calculates percentages', () => {
        assert.strictEqual(percent(50, 200), 100)
        assert.strictEqual(percent(25, 80), 20)
        assert.strictEqual(percent(75, 120), 90)
        assert.strictEqual(percent(-50, 200), -100)
    })

    it('throws for invalid input', () => {
        assert.throws(() => percent('50', 200))
        assert.throws(() => percent(50, '200'))
        assert.throws(() => percent(NaN, 200))
    })
})

describe(percentToRatio.name, () => {
    it('converts percent values to ratios', () => {
        assert.strictEqual(percentToRatio(50), 0.5)
        assert.strictEqual(percentToRatio(25), 0.25)
        assert.strictEqual(percentToRatio(75), 0.75)
    })
})

describe(toFixed.name, () => {
    it('rounds numbers to fixed precision', () => {
        assert.strictEqual(toFixed(1.2345), 1.234)
        assert.strictEqual(toFixed(3.14159, 2), 3.14)
        assert.strictEqual(toFixed(0.123456789, 6), 0.123457)
        assert.strictEqual(toFixed(99.999), 99.999)
        assert.strictEqual(toFixed(0.001), 0.001)
    })
})

describe(clamp.name, () => {
    it('clamps values to bounds', () => {
        assert.strictEqual(clamp(5, 0, 10), 5)
        assert.strictEqual(clamp(15, 0, 10), 10)
        assert.strictEqual(clamp(-5, 0, 10), 0)
    })
})

describe(range.name, () => {
    it('calculates range for valid arrays', () => {
        assert.deepStrictEqual(range([1, 2, 3, 4, 5]), [1, 5])
        assert.deepStrictEqual(range([0, 0, 0, 0, 0]), [0, 0])
        assert.deepStrictEqual(range([-1, -2, -3, -4, -5]), [-5, -1])
        assert.deepStrictEqual(range([1]), [1, 1])
    })

    it('throws for invalid arrays', () => {
        assert.throws(() => range(true), TypeError)
        assert.throws(() => range([]), RangeError)
        assert.throws(() => range(['a', 'b', 'c']), TypeError)
    })
})
