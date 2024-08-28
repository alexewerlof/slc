import { test, assertEquals, assertThrows } from '../vendor/deno.js'
import { sampleData } from './data.js'

test('sampleData()', () => {
    const dataArr = [1, 2, 3, 4, 5]
    const sampleSize = 3
    const sampledData = sampleData(dataArr, sampleSize)
    assertEquals(sampledData.length, sampleSize)
    assertEquals(sampledData.every(n => dataArr.includes(n)), true)
    assertEquals(sampleData(dataArr, dataArr.length), dataArr)
    assertEquals(sampleData(dataArr, dataArr.length + 1), dataArr)
    assertThrows(() => sampleData(dataArr, 0))
})