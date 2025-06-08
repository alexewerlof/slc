import test from 'node:test'
import assert from 'node:assert/strict'
import { createSingleFlight, delay } from './promise.js'

test('createSingleFlight() basic functionality', async () => {
    let counter = 0
    const singleFlight = createSingleFlight(async (n) => {
        counter++
        await delay(300)
        return `test result. n=${n} counter=${counter}`
    })

    const [resultA1, resultA2] = await Promise.all([singleFlight(1), singleFlight(2)])

    assert.strictEqual(resultA1, `test result. n=1 counter=1`)
    assert.strictEqual(resultA2, `test result. n=1 counter=1`)
    assert.strictEqual(counter, 1)

    // Do it again, and it should start a new call
    const [resultB1, resultB2] = await Promise.all([singleFlight(1), singleFlight(2)])

    assert.strictEqual(resultB1, `test result. n=1 counter=2`)
    assert.strictEqual(resultB2, `test result. n=1 counter=2`)
    assert.strictEqual(counter, 2)
})

test('createSingleFlight() error handling', async () => {
    let counter = 0
    const singleFlight = createSingleFlight(async (n) => {
        counter++
        await delay(n * 300)
        throw new Error(`test error. n=${n} counter=${counter}`)
    })

    const [resultA1, resultA2] = await Promise.allSettled([singleFlight(1), singleFlight(2)])
    assert.strictEqual(resultA1.status, 'rejected')
    assert.strictEqual(resultA1.reason.message, 'test error. n=1 counter=1')
    assert.strictEqual(resultA2.status, 'rejected')
    assert.strictEqual(resultA2.reason.message, 'test error. n=1 counter=1')
    assert.strictEqual(counter, 1)

    // Do it again, and it should start a new call
    const [resultB1, resultB2] = await Promise.allSettled([singleFlight(1), singleFlight(2)])
    assert.strictEqual(resultB1.status, 'rejected')
    assert.strictEqual(resultB1.reason.message, 'test error. n=1 counter=2')
    assert.strictEqual(resultB2.status, 'rejected')
    assert.strictEqual(resultB2.reason.message, 'test error. n=1 counter=2')
    assert.strictEqual(counter, 2)
})
