import test from 'node:test'
import assert from 'node:assert/strict'
import { sampleData } from './data.js'

test('sampleData()', () => {
    const dataArr = [1, 2, 3, 4, 5]
    const sampleSize = 3
    const sampledData = sampleData(dataArr, sampleSize)
    assert.strictEqual(sampledData.length, sampleSize)
    assert.strictEqual(sampledData.every((n) => dataArr.includes(n)), true)
    assert.strictEqual(sampleData(dataArr, dataArr.length), dataArr)
    assert.strictEqual(sampleData(dataArr, dataArr.length + 1), dataArr)
    assert.throws(() => sampleData(dataArr, 0))
})
