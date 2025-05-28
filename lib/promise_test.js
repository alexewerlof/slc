import { assertEquals, test } from '../vendor/deno.js'
import { createSingleFlight, delay } from './promise.js'

test('createSingleFlight() basic functionality', async () => {
    let counter = 0
    const singleFlight = createSingleFlight(async (n) => {
        counter++
        await delay(300)
        return `test result. n=${n} counter=${counter}`
    })

    const [resultA1, resultA2] = await Promise.all([singleFlight(1), singleFlight(2)])

    assertEquals(resultA1, `test result. n=1 counter=1`)
    assertEquals(resultA2, `test result. n=1 counter=1`)
    assertEquals(counter, 1)

    // Do it again, and it should start a new call
    const [resultB1, resultB2] = await Promise.all([singleFlight(1), singleFlight(2)])

    assertEquals(resultB1, `test result. n=1 counter=2`)
    assertEquals(resultB2, `test result. n=1 counter=2`)
    assertEquals(counter, 2)
})

test('createSingleFlight() error handling', async () => {
    let counter = 0
    const singleFlight = createSingleFlight(async (n) => {
        counter++
        await delay(n * 300)
        throw new Error(`test error. n=${n} counter=${counter}`)
    })

    const [resultA1, resultA2] = await Promise.allSettled([singleFlight(1), singleFlight(2)])
    assertEquals(resultA1.status, 'rejected')
    assertEquals(resultA1.reason.message, 'test error. n=1 counter=1')
    assertEquals(resultA2.status, 'rejected')
    assertEquals(resultA2.reason.message, 'test error. n=1 counter=1')
    assertEquals(counter, 1)

    // Do it again, and it should start a new call
    const [resultB1, resultB2] = await Promise.allSettled([singleFlight(1), singleFlight(2)])
    assertEquals(resultB1.status, 'rejected')
    assertEquals(resultB1.reason.message, 'test error. n=1 counter=2')
    assertEquals(resultB2.status, 'rejected')
    assertEquals(resultB2.reason.message, 'test error. n=1 counter=2')
    assertEquals(counter, 2)
})
