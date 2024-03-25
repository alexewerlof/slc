const commonTags = [ 'async', 'queue' ]

export default [
    {
        title: 'Throughput: Worker Efficiency',
        description: 'The number of minutes where an expensive wroker processed enough requests to justify the cost of keeping it alive. "Enough requests" is defined as ≥ 100',
        unit: 60,
        good: 'processed messages ≥ 100',
        tags: [ ...commonTags ],
    },
    {
        title: 'Throughput: Queue length',
        description: 'The workers use an autoscaler that should kick in when the queue length is too long. If the length gets too long, we may habe a problem (latency is another metric to measure). The ratio of messages processed compared to messages waiting to be processed',
        unit: 30,
        good: 'processed_messages / waiting_messages > 0.8',
        tags: [ ...commonTags ],
    },
    {
        title: 'Throughput: Dead letter queue',
        description: 'The percentage of messages that were sent to the dead letter queue (DLQ). Messages can be sent to DLQ for a variety of reasons like: TTL expiration, message is exchanged to another queue, message has been rejected too many times, maximum queue length is exceeded, etc.',
        unit: 180,
        good: 'length(dead_letter_queue) > 0',
        tags: [ ...commonTags ],
    },
]