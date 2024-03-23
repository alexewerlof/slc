const commonTags = [ 'data' ]

/*
https://www.collibra.com/us/en/blog/the-6-dimensions-of-data-quality
*/

export default [
    {
        title: 'Latency: Database Query',
        description: 'The percentage of sufficiently fast database insertion queries. "Sufficiently fast" is defined as ≤ 100 ms',
        unit: 'insertion queries',
        good: 'query_latency ≤ 100ms',
        valid: 'all to the customers table',
        tags: [ ...commonTags ],
    },
    {
        title: 'Freshness: New Articles',
        description: 'The difference between “Published” timestamp in the browser and “Published” timestamp in the CMS is sufficiently small. "Sufficiently small" is defined as ≤ 60 seconds',
        unit: 'articles',
        good: 'cms_timestamp - web_timestamp ≤ 60',
        valid: 'from breaking news section',
        tags: [ ...commonTags ],
    },
    {
        title: 'Correctness: Main database table',
        description: 'The proportion of records coming into the pipeline that resulted in the correct value coming out.',
        unit: 'records',
        good: 'correct value',
        valid: 'incoming pipeline',
        tags: [ ...commonTags ],
    },
    {
        title: 'Coverage: Customer data',
        description: 'Percentage of customer records that have the minimum information essential for a productive engagement',
        unit: 'pipeline runs',
        good: 'sum(customer_records, containing_required_attributes)',
        valid: 'sum(customer_records)',
        tags: [ ...commonTags ],
    },
    {
        title: 'Completeness: Customer data',
        description: 'Percentage of customer records that have the minimum information essential for a productive engagement',
        unit: 'pipeline runs',
        good: 'sum(customer_records, containing_required_attributes)',
        valid: 'sum(customer_records)',
        tags: [ ...commonTags ],
    },
    {
        // https://sre.google/workbook/slo-document/
        title: 'Completeness: Game data',
        description: 'The proportion of hours in which 100% of the games in the data store were processed (no records were skipped). Uses metrics exported by the score pipeline',
        unit: 'pipeline runs',
        good: 'pipeline runs that process 100% of the records',
        valid: 'pipeline runs',
        tags: [ ...commonTags, 'api' ],
    },
    {
        title: 'Consistency: Replication Lag',
        description: 'The percentage of database write events which are repliacated in a sufficiently quick time. "Sufficiently small" is defined as < 1s',
        unit: 's',
        good: 'replication_lag ≤ 1s',
        valid: 'all database write events',
        tags: [ ...commonTags ],
    },
    {
        title: 'Accuracy: Account Information',
        description: 'Percentage of customer records where the account information matches the information acquired via banking API',
        unit: 'customer records',
        good: 'match_bank_record("name", "phone", "address")',
        tags: [ ...commonTags ],
    },
    {
        title: 'Consistency: Customer data',
        description: 'Percentage of order records from the order intake system that match those of the orderfulfillment system',
        unit: 'order records',
        good: 'sum(match(fulfillment_record, intake_record))',
        valid: 'sum(fulfillment_record)',
        tags: [ ...commonTags ],
    },

    {
        title: 'Validity: Personnel Data',
        description: 'Percentage of active personnel record where the height information is valid',
        unit: 'records',
        good: 'sum(active_personnel_records, 18 <= person.age <= 65)',
        valid: 'sum(active_personnel_records)',
        tags: [ ...commonTags ],
    },
    {
        title: 'Uniqueness: Profile Pictures',
        description: 'For fraud detection or reducing errors, we want to make sure that no two profiles have the same profile picture.',
        unit: 'profile pictures',
        good: 'sum(unique(profile_picture))',
        valid: 'sum(profile_picture)',
        tags: [ ...commonTags ],
    },
]