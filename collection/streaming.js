import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Availability: Event Delivery Success Rate',
        description:
            'The percentage of events published to a topic/stream that are successfully consumed by all intended subscribers.',
        eventUnit: 'events published to a topic/stream',
        metricName: 'successfully consumed by all intended subscribers',
    }),
    new Indicator({
        displayName: 'Latency: End-to-End Event Latency',
        description:
            'The percentage of events where the time from producer publish to final consumer processing is sufficiently fast.',
        eventUnit: 'events',
        metricName: 'time from producer publish to final consumer processing',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Throughput: Event Processing Rate',
        description:
            'The percentage of 5-minute timeslices where the number of events processed per second is sufficiently high.',
        timeslice: 300,
        metricName: 'events processed per second',
        lowerBound: 'ge',
    }),
    new Indicator({
        displayName: 'Freshness: Data Staleness',
        description:
            'The percentage of consumers where the age of the oldest unread message in their queue is sufficiently low.',
        eventUnit: 'consumers',
        metricName: 'age of the oldest unread message in consumer queue',
        metricUnit: 's',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Ordering: Event Order Preservation',
        description:
            'The percentage of event sequences where events are processed in the same order they were published.',
        eventUnit: 'event sequences',
        metricName: 'events processed in the same order they were published',
    }),
]
