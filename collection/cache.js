import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Latency: Cache latency',
        description: 'The percentage of sufficiently fast cache response.',
        eventUnit: 'cache requests',
        metricName: 'response_time',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Throughput: Cache hit',
        description: 'The number of requests that were responded via the cache storage instead of going to the origin',
        eventUnit: 'request',
        metricName: 'responded from cache',
    }),
    new Indicator({
        displayName: 'Freshness: Cache hit freshness',
        description: 'The percentage of responses from cache that are fresh (not stale)',
        eventUnit: 'cache hits',
        metricName: 'max_age - now',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Consistency: Cache',
        description: 'Percentage cache entries which match the data in the upstream. Use sampling to randomly check.',
        eventUnit: 'cache entries',
        metricName: 'cache_entry == origin_entry',
        metricUnit: 'entries',
    }),
]
