import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Completeness: Job Completion Rate',
        description: 'The percentage of scheduled background jobs that complete successfully.',
        eventUnit: 'scheduled background jobs',
        metricName: 'job.status == "success"',
    }),
    new Indicator({
        displayName: 'Latency: Job Execution Time',
        description: 'The percentage of completed background jobs where the total execution time is sufficiently fast.',
        eventUnit: 'completed background jobs',
        metricName: 'job.execution_time',
        metricUnit: 's',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Correctness: Output Validity',
        description:
            'The percentage of background jobs that produce output data conforming to predefined validation rules.',
        eventUnit: 'background jobs',
        metricName: 'output.validation.status == "valid"',
    }),
    new Indicator({
        displayName: 'Availability: Queue Backlog',
        description:
            'The percentage of 15-minute timeslices where the number of jobs waiting in the queue is sufficiently small.',
        timeslice: 900,
        metricName: 'queue.backlog.size',
        upperBound: 'le',
    }),
]
