const commonTags = [ 'ops', 'operations' ]

export default [
    {
        title: 'Incident Handling Speed',
        description: 'The percentage of highly severe incidents that were resolved sufficiently fast.',
        eventUnit: 'SEV1|2 incidents',
        metricName: 'time_to_restore',
        metricUnit: 'min',
        upperBound: 'le',
        upperThreshold: 30,
        tags: [ ...commonTags, 'MTTR' ],
    },
    {
        title: 'Time To Acknolwledge',
        description: 'The percentage of high priority incidents that were acknowledged sufficiently fast.',
        eventUnit: 'SEV1 incidents',
        metricName: 'time_to_acknowledge',
        metricUnit: 'min',
        upperBound: 'le',
        upperThreshold: 5,
        tags: [ ...commonTags, 'MTTA' ],
    },
]