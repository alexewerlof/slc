import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Availability: Search Query Success Rate',
        description: 'The percentage of search queries that return a non-empty result set and a 2xx HTTP status code.',
        eventUnit: 'search queries',
        metricName: 'non-empty result set and 2xx HTTP status code',
    }),
    new Indicator({
        displayName: 'Latency: Search Response Time',
        description: 'The percentage of search queries where the time to return results is sufficiently fast.',
        eventUnit: 'search queries',
        metricName: 'time to return results',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Relevance: Top-K Result Quality',
        description:
            'The percentage of search queries where at least one result within the top 10 matches a predefined relevance heuristic.',
        eventUnit: 'search queries',
        metricName: 'at least one result within the top 10 matches a predefined relevance heuristic',
    }),
    new Indicator({
        displayName: 'Freshness: Indexing Freshness',
        description:
            'The percentage of source data updates that are reflected in the search index within a sufficiently short time.',
        eventUnit: 'source data updates',
        metricName: 'time to reflect in index',
        metricUnit: 's',
        upperBound: 'le',
    }),
]
