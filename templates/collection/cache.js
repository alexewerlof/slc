const commonTags = [ 'web', 'api', 'cache' ]

export default [
    {
        title: 'Latency: Cache latency',
        description: 'The percentage of sufficiently fast cache response.',
        eventUnit: 'cache requests',
        metricName: 'response_time',
        upperBound: 'le',
        upperThreshold: 10,
        tags: [ ...commonTags ],
    },
    {
        title: 'Throughput: Cache hit',
        description: 'The number of requests that were responded via the cache storage instead of going to the origin',
        eventUnit: 'request',
        metricName: 'responded from cache',
        tags: [ ...commonTags ],
    },
    {
        title: 'Freshness: Cache hit freshness',
        description: 'The percentage of responses from cache that are fresh (not stale)',
        eventUnit: 'cache hits',
        metricName: 'max_age - now',
        upperBound: 'le',
        upperThreshold: 100,
        metricUnit: 'ms',
        tags: [ ...commonTags ],
    },
    {
        title: 'Consistency: Cache',
        description: 'Percentage cache entries which match the data in the upstream. Use sampling to randomly check.',
        eventUnit: 'cache entries',
        metricName: 'cache_entry == origin_entry',
        metricUnit: 'entries',
        tags: [ ...commonTags ],
    },
]