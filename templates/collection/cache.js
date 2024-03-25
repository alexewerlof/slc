const commonTags = [ 'web', 'api', 'cache' ]

export default [
    {
        title: 'Latency: Cache latency',
        description: 'The percentage of sufficiently fast cache response. "Sufficiently fast" is defined as ≤ 10 ms',
        unit: 'cache requests',
        good: 'response_time ≤ 10ms',
        tags: [ ...commonTags ],
    },
    {
        title: 'Throughput: Cache hit',
        description: 'The number of requests that were responded via the cache storage instead of going to the origin',
        unit: 'request',
        good: 'responded from cache',
        tags: [ ...commonTags ],
    },
    {
        title: 'Freshness: Cache hit freshness',
        description: 'The percentage of responses from cache that are fresh (not stale)',
        unit: 'cache hits',
        good: 'fresh',
        tags: [ ...commonTags ],
    },
    {
        title: 'Consistency: Cache',
        description: 'Percentage cache entries which match the data in the upstream. Use sampling to randomly check.',
        unit: 'cache entries',
        good: 'sum(match(cache_entry, database_record))',
        valid: 'sum(cache_entry)',
        tags: [ ...commonTags ],
    },
]