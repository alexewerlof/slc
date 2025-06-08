import test from 'node:test'
import assert from 'node:assert/strict'
import {
    boundTypeToOperator,
    calculateSlsMetric,
    createIsGood,
    createIsGoodFnBody,
    metricToGood,
    movingWindowBooleanCounter,
} from './sl.js'

test('createIsGood(): lowerBound', () => {
    const sli = {
        lowerBound: 'gt',
    }
    const slo = {
        lowerThreshold: 5,
    }
    const isGood = createIsGood(sli, slo)

    assert.strictEqual(isGood(4), false)
    assert.strictEqual(isGood(5), false)
    assert.strictEqual(isGood(6), true)
})

test('createIsGood(): upperBound', () => {
    const sli = {
        upperBound: 'le',
    }
    const slo = {
        upperThreshold: 10,
    }
    const isGood = createIsGood(sli, slo)

    assert.strictEqual(isGood(9), true)
    assert.strictEqual(isGood(10), true)
    assert.strictEqual(isGood(11), false)
})

test('createIsGood(): lowerBound and upperBound', () => {
    const sli = {
        lowerBound: 'gt',
        upperBound: 'le',
    }
    const slo = {
        lowerThreshold: 5,
        upperThreshold: 10,
    }
    const isGood = createIsGood(sli, slo)

    assert.strictEqual(isGood(4), false)
    assert.strictEqual(isGood(5), false)
    assert.strictEqual(isGood(6), true)
    assert.strictEqual(isGood(9), true)
    assert.strictEqual(isGood(10), true)
    assert.strictEqual(isGood(11), false)
})

test('boundTypeToOperator()', () => {
    assert.strictEqual(boundTypeToOperator('lt'), '<')
    assert.strictEqual(boundTypeToOperator('gt'), '>')
    assert.strictEqual(boundTypeToOperator('le'), '<=')
    assert.strictEqual(boundTypeToOperator('ge'), '>=')
    assert.strictEqual(boundTypeToOperator(''), '')
    assert.strictEqual(boundTypeToOperator(), '')
})

test('createIsGoodFnBody()', () => {
    assert.deepStrictEqual(
        createIsGoodFnBody('dataPoint', {
            lowerBound: 'gt',
        }, {
            lowerThreshold: 1,
        }),
        `return dataPoint > 1`,
    )

    assert.deepStrictEqual(
        createIsGoodFnBody('dataPoint', {
            lowerBound: 'ge',
        }, {
            lowerThreshold: 2,
        }),
        `return dataPoint >= 2`,
    )

    assert.deepStrictEqual(
        createIsGoodFnBody('dataPoint', {
            upperBound: 'lt',
        }, {
            upperThreshold: 3,
        }),
        `return dataPoint < 3`,
    )

    assert.deepStrictEqual(
        createIsGoodFnBody('dataPoint', {
            upperBound: 'le',
        }, {
            upperThreshold: 4,
        }),
        `return dataPoint <= 4`,
    )

    assert.deepStrictEqual(
        createIsGoodFnBody('dataPoint', {
            lowerBound: 'gt',
            upperBound: 'le',
        }, {
            lowerThreshold: 5,
            upperThreshold: 10,
        }),
        `return dataPoint > 5 && dataPoint <= 10`,
    )
})

test('metricToGood()', () => {
    const sli = {
        lowerBound: 'gt',
        upperBound: 'le',
    }
    const slo = {
        lowerThreshold: 5,
        upperThreshold: 10,
    }
    const metricData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const expected = [false, false, false, false, false, false, true, true, true, true, true, false]
    assert.deepStrictEqual(metricToGood(metricData, sli, slo), expected)
})

test('movingWindowBooleanCounter()', () => {
    const metricData = [true, true, false, false, true, true, true, false, false, false]
    const expectedCounts = [
        {
            good: 1,
            bad: 0,
            valid: 1,
        },
        {
            good: 2,
            bad: 0,
            valid: 2,
        },
        {
            good: 2,
            bad: 1,
            valid: 3,
        },
        {
            good: 1,
            bad: 2,
            valid: 3,
        },
        {
            good: 1,
            bad: 2,
            valid: 3,
        },
        {
            good: 2,
            bad: 1,
            valid: 3,
        },
        {
            good: 3,
            bad: 0,
            valid: 3,
        },
        {
            good: 2,
            bad: 1,
            valid: 3,
        },
        {
            good: 1,
            bad: 2,
            valid: 3,
        },
        {
            good: 0,
            bad: 3,
            valid: 3,
        },
    ]
    const windowDataCount = 3
    assert.deepStrictEqual(movingWindowBooleanCounter(metricData, windowDataCount), expectedCounts)
    assert.deepStrictEqual(movingWindowBooleanCounter([true, false, true], 3), [
        {
            good: 1,
            bad: 0,
            valid: 1,
        },
        {
            good: 1,
            bad: 1,
            valid: 2,
        },
        {
            good: 2,
            bad: 1,
            valid: 3,
        },
    ])
    assert.deepStrictEqual(movingWindowBooleanCounter([true, true], 15), [
        {
            good: 1,
            bad: 0,
            valid: 1,
        },
        {
            good: 2,
            bad: 0,
            valid: 2,
        },
    ])
})

test('calculateSlsMetric()', () => {
    const metricData = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    const windowDataCount = 4
    const expected = [0, 0, 0, 1, 2, 3, 4, 4, 3, 2].map((goodCount) => goodCount * 100 / windowDataCount)
    const sli = {
        lowerBound: 'gt',
        upperBound: 'le',
    }
    const slo = {
        lowerThreshold: 300,
        upperThreshold: 800,
        windowDataCount,
    }
    assert.deepStrictEqual(calculateSlsMetric(metricData, sli, slo), expected)
})
