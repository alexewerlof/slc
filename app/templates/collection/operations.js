const commonTags = ['ops', 'operations']

export default [
    {
        title: 'Latency: Incident Handling Speed',
        description: 'The percentage of highly severe incidents that were resolved sufficiently fast.',
        eventUnit: 'SEV1|2 incidents',
        metricName: 'time_to_restore',
        metricUnit: 'min',
        upperBound: 'le',
        upperThreshold: 30,
        tags: [...commonTags, 'MTTR'],
    },
    {
        title: 'Latency: Time To Acknowledge',
        description: 'The percentage of high priority incidents that were acknowledged sufficiently fast.',
        eventUnit: 'SEV1 incidents',
        metricName: 'time_to_acknowledge',
        metricUnit: 'min',
        upperBound: 'le',
        upperThreshold: 5,
        tags: [...commonTags, 'MTTA'],
    },
    {
        title: 'Accuracy: Incident Triage',
        description: 'The percentage of incidents that were triaged in time.',
        eventUnit: 'incidents',
        metricName: 'time_to_triage',
        metricUnit: 'min',
        upperBound: 'le',
        upperThreshold: 5,
        tags: [...commonTags, 'MTTT'],
    },
    {
        title: 'Efficiency: Automatic detection',
        description: 'The percentage of incidents that were detected automatically.',
        eventUnit: 'incidents',
        metricName: 'detection_method == AUTO',
        metricUnit: 'Boolean',
    },
    {
        title: 'Accuracy: Non-false alerts',
        description: 'The percentage of incidents that were not false alerts and were actually worth investigating.',
        eventUnit: 'incidents',
        metricName: 'alert_seveirty_level',
        upperBound: 'le',
        upperThreshold: 4,
    },
]
