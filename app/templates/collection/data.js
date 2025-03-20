const commonTags = [ 'data' ]

/*
https://www.collibra.com/us/en/blog/the-6-dimensions-of-data-quality
*/

export default [
    {
        title: 'Latency: Database Query',
        description: 'The percentage of sufficiently fast database insertion queries.',
        eventUnit: 'customer table insertions',
        metricName: 'query_latency',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 100,
        tags: [ ...commonTags, 'nosql', 'rdbms' ],
    },
    {
        title: 'Freshness: New Articles',
        description: 'The difference between “Published” timestamp in the browser and “Published” timestamp in the CMS is sufficiently small.',
        eventUnit: 'breaking news articles',
        metricName: 'cms_timestamp - web_timestamp',
        metricUnit: 's',
        upperBound: 'le',
        upperThreshold: 60,
        tags: [ ...commonTags, 'cache' ],
    },
    {
        title: 'Correctness: Main database table',
        description: 'The proportion of records coming into the pipeline that resulted in the correct value coming out.',
        eventUnit: 'incoming pipeline records',
        metricName: 'isCorrect(outputValue)',
        tags: [ ...commonTags, 'nosql', 'rdbms' ],
    },
    {
        title: 'Coverage: Order data',
        description: 'Percentage of order records that exist in the fulfillment system',
        eventUnit: 'order records',
        metricName: 'exist in fulfillment system',
        tags: [ ...commonTags, 'nosql', 'rdbms', 'retail' ],
    },
    {
        title: 'Completeness: Customer data',
        description: 'Percentage of customer records that have the minimum information essential for a productive engagement',
        eventUnit: 'customer records',
        metricName: 'contain required attributes',
        tags: [ ...commonTags, 'nosql', 'rdbms' ],
    },
    {
        // https://sre.google/workbook/slo-document/
        title: 'Completeness: Game data',
        description: 'The proportion of hours in which 100% of the games in the data store were processed (no records were skipped). Uses metrics exported by the score pipeline',
        eventUnit: 'pipeline runs',
        metricName: 'processed records percentage',
        lowerBound: 'ge',
        lowerThreshold: 100,
        tags: [ ...commonTags, 'api', 'nosql', 'rdbms' ],
    },
    {
        title: 'Consistency: Replication Lag',
        description: 'The percentage of database write events which are repliacated in a sufficiently quick time.',
        eventUnit: 'database writes',
        metricName: 'replication_lag',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 1000,
        tags: [ ...commonTags, 'nosql', 'rdbms', 'files' ],
    },
    {
        title: 'Accuracy: Account Information',
        description: 'Percentage of customer records where the account information matches the information acquired via banking API',
        eventUnit: 'customer records',
        metricName: 'database_record == api_record',
        tags: [ ...commonTags, 'nosql', 'rdbms' ],
    },
    {
        title: 'Consistency: Customer data',
        description: 'Percentage of order records from the order intake system that match those of the order fulfillment system',
        eventUnit: 'order records',
        metricName: 'order.status == "fulfilled"',
        tags: [ ...commonTags, 'nosql', 'rdbms', 'retail' ],
    },

    {
        title: 'Validity: Person height',
        description: 'Percentage of personnel records where the height information is eventUnit',
        eventUnit: 'personnel records',
        metricName: 'person.height',
        metricUnit: 'cm',
        lowerBound: 'ge',
        lowerThreshold: 120,
        upperBound: 'le',
        upperThreshold: 240,
        tags: [ ...commonTags, 'nosql', 'rdbms' ],
    },
    {
        title: 'Uniqueness: Profile Pictures',
        description: 'For fraud detection or reducing errors, we want to make sure that no two profiles have the same profile picture.',
        eventUnit: 'profile pictures',
        metricName: 'unique',
        tags: [ ...commonTags, 'nosql', 'rdbms', 'files' ],
    },
]