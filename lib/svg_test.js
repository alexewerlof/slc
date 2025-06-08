import test from 'node:test'
import assert from 'node:assert/strict'
import { arrToPolygonPoints } from './svg.js'

test('arrToPolygonPoints', () => {
    const coordinates = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
    ]
    const expected = '0,0 0,1 1,1 1,0'
    assert.strictEqual(arrToPolygonPoints(...coordinates), expected)
})

test('arrToPolygonPoints throws with no input', () => {
    assert.throws(() => arrToPolygonPoints())
})

test('arrToPolygonPoints with single point', () => {
    assert.strictEqual(
        arrToPolygonPoints(
            [0, 0],
        ),
        '0,0',
    )
})

test('arrToPolygonPoints with invalid input', () => {
    const coordinates = [1, 2, 3]
    assert.throws(() => arrToPolygonPoints(...coordinates))
})

test('arrToPolygonPoints with invalid input', () => {
    assert.throws(() => arrToPolygonPoints([1, 2, 3]))
})

test('arrToPolygonPoints with invalid input', () => {
    assert.throws(() =>
        arrToPolygonPoints(
            ['1', 2],
            [3, 4],
        )
    )
    assert.throws(() =>
        arrToPolygonPoints(
            [1, 2],
            [3, '4'],
        )
    )
})
