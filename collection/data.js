/*
https://www.collibra.com/us/en/blog/the-6-dimensions-of-data-quality
*/

import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Latency: Database Query',
        description: 'The percentage of sufficiently fast database insertion queries.',
        eventUnit: 'insertions',
        metricName: 'query_latency',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Freshness: New Articles',
        description:
            'The difference between “Published” timestamp in the public website and “Published” timestamp in the CMS is sufficiently small.',
        eventUnit: 'breaking news articles',
        metricName: 'abs(cms_timestamp - web_timestamp)',
        metricUnit: 's',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Correctness: Main database table',
        description:
            'The proportion of records coming into the pipeline that resulted in the correct value coming out.',
        eventUnit: 'incoming pipeline records',
        metricName: 'isCorrect(outputValue)',
    }),
    new Indicator({
        displayName: 'Coverage: Order data',
        description: 'Percentage of order records that exist in the fulfillment system',
        eventUnit: 'order records',
        metricName: 'exist in fulfillment system',
    }),
    new Indicator({
        displayName: 'Completeness: Customer data',
        description:
            'Percentage of customer records that have the minimum information essential for a productive engagement',
        eventUnit: 'customer records',
        metricName: 'contain required attributes',
    }),
    new Indicator({
        // https://sre.google/workbook/slo-document/
        displayName: 'Completeness: Game data',
        description:
            'The proportion of hours in which a sufficienntly high number of game data in the data store were processed (no records were skipped). Uses metrics exported by the score pipeline',
        eventUnit: 'pipeline runs',
        metricName: 'processed records percentage',
        lowerBound: 'ge',
    }),
    new Indicator({
        displayName: 'Consistency: Replication Lag',
        description: 'The percentage of database write events which are repliacated in a sufficiently quick time.',
        eventUnit: 'database writes',
        metricName: 'replication_lag',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Accuracy: Account Information',
        description:
            'Percentage of customer records where the account information matches the information acquired via banking API',
        eventUnit: 'customer records',
        metricName: 'database_record == api_record',
    }),
    new Indicator({
        displayName: 'Consistency: Customer data',
        description:
            'Percentage of order records from the order intake system that match those of the order fulfillment system',
        eventUnit: 'order records',
        metricName: 'order.status == "fulfilled"',
    }),

    new Indicator({
        displayName: 'Validity: Person height',
        description: 'Percentage of personnel records where the height information is within a valid range.',
        eventUnit: 'personnel records',
        metricName: 'person.height',
        metricUnit: 'cm',
        lowerBound: 'ge',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Uniqueness: Profile Pictures',
        description:
            'For fraud detection or reducing errors, we want to make sure that no two profiles have the same profile picture.',
        eventUnit: 'profile pictures',
        metricName: 'unique',
    }),
]
