import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { arrToPolygonPoints } from './svg.js'

describe(arrToPolygonPoints.name, () => {
    it('formats coordinate arrays as polygon points', () => {
        const coordinates = [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
        ]
        const expected = '0,0 0,1 1,1 1,0'
        assert.strictEqual(arrToPolygonPoints(...coordinates), expected)
    })

    it('throws with no input', () => {
        assert.throws(() => arrToPolygonPoints())
    })

    it('handles a single point', () => {
        assert.strictEqual(arrToPolygonPoints([0, 0]), '0,0')
    })

    it('throws for invalid coordinate array spread', () => {
        const coordinates = [1, 2, 3]
        assert.throws(() => arrToPolygonPoints(...coordinates))
    })

    it('throws for invalid coordinate tuple size', () => {
        assert.throws(() => arrToPolygonPoints([1, 2, 3]))
    })

    it('throws for non-number coordinate values', () => {
        assert.throws(() => arrToPolygonPoints(['1', 2], [3, 4]))
        assert.throws(() => arrToPolygonPoints([1, 2], [3, '4']))
    })
})
