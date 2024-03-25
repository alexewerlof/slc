const commonTags = [ 'ops', 'operations' ]

export default [
    {
        title: 'Incident Handling Speed',
        description: 'The percentage of highly severe incidents that were resolved sufficiently fast. "Sufficiently fast" is defined as < 30m',
        unit: 'incidents',
        good: 'time_to_restore ≤ 30m',
        valid: 'Incident Severity == 1 || 2',
        tags: [ ...commonTags, 'MTTR' ],
    },
    {
        title: 'Time To Acknolwledge',
        description: 'The percentage of high priority incidents that were acknowledged sufficiently fast. "Sufficiently fast" is defined as < 5m',
        unit: 'incidents',
        good: 'time_to_acknowledge ≤ 5m',
        valid: 'Incident Priority == 1',
        tags: [ ...commonTags, 'MTTA' ],
    },
]