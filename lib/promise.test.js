import test from 'node:test'
import assert from 'node:assert/strict'
import { createSequentialExecutor, createSingleFlight, delay } from './promise.js'

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

test('createSequentialExecutor basic functionality', async () => {
    const executionLog = []
    let callCount = 0
    const sequentialExec = createSequentialExecutor(async (id, delayMs) => {
        callCount++
        executionLog.push(`start-${id}`)
        await delay(delayMs)
        executionLog.push(`end-${id}`)
        return `result-${id}-call-${callCount}`
    })

    const p1 = sequentialExec('A', 200) // starts immediately
    const p2 = sequentialExec('B', 50) // queues after A completes
    const p3 = sequentialExec('C', 100) // queues after B completes

    // Intentionally not awaiting p1 before starting p2, etc., to simulate concurrent initiation
    const results = await Promise.all([p1, p2, p3])

    assert.deepStrictEqual(
        executionLog,
        ['start-A', 'end-A', 'start-B', 'end-B', 'start-C', 'end-C'],
        'Execution order should be sequential',
    )
    assert.strictEqual(results[0], 'result-A-call-1', 'Result for p1')
    assert.strictEqual(results[1], 'result-B-call-2', 'Result for p2')
    assert.strictEqual(results[2], 'result-C-call-3', 'Result for p3')
    assert.strictEqual(callCount, 3, 'Total calls to original function')
})

test('createSequentialExecutor error handling', async () => {
    const executionLog = []
    let callCount = 0
    const sequentialExec = createSequentialExecutor(async (id, delayMs, shouldThrow) => {
        callCount++
        executionLog.push(`start-${id}`)
        await delay(delayMs)
        if (shouldThrow) {
            executionLog.push(`throw-${id}`)
            throw new Error(`error-${id}-call-${callCount}`)
        }
        executionLog.push(`end-${id}`)
        return `result-${id}-call-${callCount}`
    })

    const p1 = sequentialExec('A', 100, false)
    const p2 = sequentialExec('B', 50, true) // This one will throw
    const p3 = sequentialExec('C', 70, false) // This should still run after B settles

    const results = await Promise.allSettled([p1, p2, p3])

    assert.deepStrictEqual(
        executionLog,
        ['start-A', 'end-A', 'start-B', 'throw-B', 'start-C', 'end-C'],
        'Execution order with error',
    )
    assert.strictEqual(results[0].status, 'fulfilled', 'p1 status')
    assert.strictEqual(results[0].value, 'result-A-call-1', 'p1 value')
    assert.strictEqual(results[1].status, 'rejected', 'p2 status')
    assert.strictEqual(results[1].reason.message, 'error-B-call-2', 'p2 reason')
    assert.strictEqual(results[2].status, 'fulfilled', 'p3 status')
    assert.strictEqual(results[2].value, 'result-C-call-3', 'p3 value')
    assert.strictEqual(callCount, 3, 'Total calls despite error')
})
