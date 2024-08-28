import { test, assertEquals } from "../vendor/deno.js"
import { urlToState } from "./share.js"

test('An example event-based URL v0', () => {
    const url = 'https://slc.alexewerlof.com/index.html?title=Availability%3A+Error+Rate&description=The+percentage+of+authenticated+requests+that+were+successful&unit=requests&good=response_code+%3C+500&valid=authenticated&slo=99&windowDays=30&estimatedValidEvents=1000000&badEventCost=0&badEventCurrency=USD&burnRate=6&longWindowPerc=5&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        title: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        metricName: 'response_code < 500',
        eventUnit: 'authenticated requests',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 1000000,
        badEventCost: 0,
        badEventCurrency: 'USD',
        burnRate: 6,
        longWindowPerc: 5,
        shortWindowDivider: 12,
    })
})

test('An example time-based URL v0', () => {
    const url = 'https://slc.alexewerlof.com/index.html?title=Availability%3A+Synthetic+uptime&description=The+percentage+of+successful+synthetic+probes+making+a+HTTP+GET+request+to+the+root+endpoint&unit=60&good=response_code+%3D%3D+200&valid=all&slo=99&windowDays=30&estimatedValidEvents=1000000&badEventCost=0&badEventCurrency=USD&burnRate=6&longWindowPerc=5&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        title: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes making a HTTP GET request to the root endpoint',
        metricName: 'response_code == 200',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 1000000,
        badEventCost: 0,
        badEventCurrency: 'USD',
        burnRate: 6,
        longWindowPerc: 5,
        shortWindowDivider: 12,
        timeslice: 60,
    })
})

test('An example event-based URL from v1', () => {
    const url = 'https://slc.alexewerlof.com/index.html?urlVer=1&title=An+example+SLI&description=Just+a+test+to+see+how+things+work&good=response_code+%3D%3D+200&lowerBound=&upperBound=&metricUnit=&lowerThreshold=0&upperThreshold=2000&valid=all+requests&slo=99&windowDays=30&estimatedValidEvents=12345678&badEventCost=2&badEventCurrency=SEK&burnRate=14.4&longWindowPerc=2&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        urlVer: 1,
        title: 'An example SLI',
        description: 'Just a test to see how things work',
        metricName: 'response_code == 200',
        metricUnit: '',
        lowerBound: '',
        upperBound: '',
        lowerThreshold: 0,
        upperThreshold: 2000,
        eventUnit: 'all requests',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 12345678,
        badEventCost: 2,
        badEventCurrency: 'SEK',
        burnRate: 14.4,
        longWindowPerc: 2,
        shortWindowDivider: 12,
    })
})

test('An example time-based URL from v1', () => {
    const url = 'https://slc.alexewerlof.com/index.html?urlVer=1&title=An+example+time-based+SLI&description=Just+a+test+to+see+how+a+time-based+SLI+is+shared&good=P99%28request.latency%29&metricUnit=ms&lowerBound=&upperBound=lt&lowerThreshold=0&upperThreshold=2000&valid=customer+records+undefined&slo=99&windowDays=30&estimatedValidEvents=1000000&badEventCost=0&badEventCurrency=USD&burnRate=1&longWindowPerc=10&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        urlVer: 1,
        title: 'An example time-based SLI',
        description: 'Just a test to see how a time-based SLI is shared',
        metricName: 'P99(request.latency)',
        metricUnit: 'ms',
        lowerBound: '',
        upperBound: 'lt',
        lowerThreshold: 0,
        upperThreshold: 2000,
        eventUnit: 'customer records undefined',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 1000000,
        badEventCost: 0,
        badEventCurrency: 'USD',
        burnRate: 1,
        longWindowPerc: 10,
        shortWindowDivider: 12,
    })
})


test('An example event-based URL v2', () => {
    const url = 'https://slc.alexewerlof.com/index.html?urlVer=2&title=An+example+SLI&description=Just+a+test+to+see+how+things+work&metricName=response_code+%3D%3D+200&lowerBound=&upperBound=&metricUnit=&lowerThreshold=0&upperThreshold=2000&eventUnit=all+requests&slo=99&windowDays=30&estimatedValidEvents=12345678&badEventCost=2&badEventCurrency=SEK&burnRate=14.4&longWindowPerc=2&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        urlVer: 2,
        title: 'An example SLI',
        description: 'Just a test to see how things work',
        metricName: 'response_code == 200',
        metricUnit: '',
        lowerBound: '',
        upperBound: '',
        lowerThreshold: 0,
        upperThreshold: 2000,
        eventUnit: 'all requests',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 12345678,
        badEventCost: 2,
        badEventCurrency: 'SEK',
        burnRate: 14.4,
        longWindowPerc: 2,
        shortWindowDivider: 12,
    })
})

test('An example time-based URL v2', () => {
    const url = 'https://slc.alexewerlof.com/index.html?urlVer=2&title=An+example+time-based+SLI&description=Just+a+test+to+see+how+a+time-based+SLI+is+shared&metricName=P99%28request.latency%29&metricUnit=ms&lowerBound=&upperBound=lt&lowerThreshold=0&upperThreshold=2000&eventUnit=customer+records+undefined&slo=99&windowDays=30&estimatedValidEvents=1000000&badEventCost=0&badEventCurrency=USD&burnRate=1&longWindowPerc=10&shortWindowDivider=12'

    assertEquals(urlToState(url), {
        urlVer: 2,
        title: 'An example time-based SLI',
        description: 'Just a test to see how a time-based SLI is shared',
        metricName: 'P99(request.latency)',
        metricUnit: 'ms',
        lowerBound: '',
        upperBound: 'lt',
        lowerThreshold: 0,
        upperThreshold: 2000,
        eventUnit: 'customer records undefined',
        slo: 99,
        windowDays: 30,
        estimatedValidEvents: 1000000,
        badEventCost: 0,
        badEventCurrency: 'USD',
        burnRate: 1,
        longWindowPerc: 10,
        shortWindowDivider: 12,
    })
})